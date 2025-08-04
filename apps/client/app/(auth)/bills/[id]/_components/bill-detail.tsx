'use client';

import { Button, Form, Input, useAppShell } from '@dpm-core/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { LoadingBox } from '@/components/loading-box';
import { getBillDetailByIdQueryOptions } from '@/remotes/queries/bill';

const BillDetailContainer = ({ billId }: { billId: number }) => {
	const { data } = useSuspenseQuery(getBillDetailByIdQueryOptions(billId));
	const formId = useId();
	const form = useForm({
		resolver: zodResolver(
			z.object({
				name: z.string().min(1),
			}),
		),
	});
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(console.log)} id={formId}>
				<Input />
			</form>
			<BillDetailSubmitButton formId={formId} />
		</Form>
	);
};

const nonTextInputTypes = new Set([
	'checkbox',
	'radio',
	'range',
	'color',
	'file',
	'image',
	'button',
	'submit',
	'reset',
]);

function isInput(target: Element) {
	return (
		(target instanceof HTMLInputElement && !nonTextInputTypes.has(target.type)) ||
		target instanceof HTMLTextAreaElement ||
		(target instanceof HTMLElement && target.isContentEditable)
	);
}

function isMobileFirefox(): boolean | undefined {
	const userAgent = navigator.userAgent;
	return (
		typeof window !== 'undefined' &&
		((/Firefox/.test(userAgent) && /Mobile/.test(userAgent)) || // Android Firefox
			/FxiOS/.test(userAgent)) // iOS Firefox
	);
}

const WINDOW_TOP_OFFSET = 26;

const BillDetailSubmitButton = ({ formId }: { formId: string }) => {
	const { ref } = useAppShell();

	const keyboardIsOpen = useRef(false);
	const previousDiffFromInitial = useRef(0);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const initialDrawerHeight = useRef(0);

	useEffect(() => {
		function onVisualViewportChange() {
			if (!buttonRef.current) return;

			const focusedElement = document.activeElement as HTMLElement;
			if (isInput(focusedElement) || keyboardIsOpen.current) {
				const visualViewportHeight = window.visualViewport?.height || 0;
				const totalHeight = window.innerHeight;
				// This is the height of the keyboard
				const diffFromInitial = totalHeight - visualViewportHeight;
				const drawerHeight = buttonRef.current.getBoundingClientRect().height || 0;
				// Adjust drawer height only if it's tall enough
				const isTallEnough = drawerHeight > totalHeight * 0.8;

				// if (!initialDrawerHeight.current) {
				// 	initialDrawerHeight.current = drawerHeight;
				// }
				const offsetFromTop = buttonRef.current.getBoundingClientRect().top;

				// visualViewport height may change due to somq e subtle changes to the keyboard. Checking if the height changed by 60 or more will make sure that they keyboard really changed its open state.
				if (Math.abs(previousDiffFromInitial.current - diffFromInitial) > 60) {
					keyboardIsOpen.current = !keyboardIsOpen.current;
				}

				// if (snapPoints && snapPoints.length > 0 && snapPointsOffset && activeSnapPointIndex) {
				// 	const activeSnapPointHeight = snapPointsOffset[activeSnapPointIndex] || 0;
				// 	diffFromInitial += activeSnapPointHeight;
				// }
				previousDiffFromInitial.current = diffFromInitial;
				// We don't have to change the height if the input is in view, when we are here we are in the opened keyboard state so we can correctly check if the input is in view
				if (drawerHeight > visualViewportHeight || keyboardIsOpen.current) {
					const height = buttonRef.current.getBoundingClientRect().height;
					let newDrawerHeight = height;

					if (height > visualViewportHeight) {
						newDrawerHeight =
							visualViewportHeight - (isTallEnough ? offsetFromTop : WINDOW_TOP_OFFSET);
					}

					buttonRef.current.style.height = `${Math.max(newDrawerHeight, visualViewportHeight - offsetFromTop)}px`;
				} else if (!isMobileFirefox()) {
					buttonRef.current.style.height = `${initialDrawerHeight.current}px`;
				}

				if (!keyboardIsOpen.current) {
					buttonRef.current.style.bottom = `0px`;
				} else {
					// Negative bottom value would never make sense
					buttonRef.current.style.bottom = `${Math.max(diffFromInitial, 0)}px`;
				}
			}
		}

		window.visualViewport?.addEventListener('resize', onVisualViewportChange);
		return () => window.visualViewport?.removeEventListener('resize', onVisualViewportChange);
	}, []);

	return createPortal(
		<Button
			ref={buttonRef}
			className="fixed bottom-0 w-full mx-auto"
			variant="secondary"
			size="full"
			style={{
				maxWidth: ref.current.clientWidth,
			}}
			form={formId}
		>
			참석여부 제출하기
		</Button>,
		ref.current,
	);
};

const BillDetail = ErrorBoundary.with({ fallback: <></> }, (props: { billId: number }) => (
	<Suspense fallback={<LoadingBox />}>
		<BillDetailContainer billId={props.billId} />
	</Suspense>
));

export { BillDetail };
