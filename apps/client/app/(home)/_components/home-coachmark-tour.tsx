'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Button, cn, IconButton, useAppShell, XIcon } from '@dpm-core/shared';

const STEPS = [
	{
		target: 'attendance-check',
		title: '출석은 여기서 시작해요',
		description: '출석 시간이 되면 버튼을 누르고 운영진이 안내한 4자리 코드를 입력해요.',
	},
	{
		target: 'session-info',
		title: '이번 세션 정보를 확인해요',
		description: '세션 시작 시간과 장소를 홈에서 미리 확인할 수 있어요.',
	},
	{
		target: 'attendance-history',
		title: '내 출석 기록을 확인해요',
		description: '출석·지각·결석 내역을 확인하고 결석한 세션의 사유를 제출할 수 있어요.',
	},
	{
		target: 'my-page',
		title: '내 정보는 여기서 확인해요',
		description: '프로필과 계정 정보를 확인하고 필요한 설정을 관리할 수 있어요.',
	},
	{
		target: 'feedback',
		title: '사용 의견을 남겨주세요',
		description: '불편했던 점이나 바라는 기능을 코어 팀에 자유롭게 남길 수 있어요.',
	},
	{
		target: 'user-guide',
		title: '가이드를 다시 보고싶다면?',
		description: '사용법이 궁금할 때는 이곳에서 가이드를 다시 확인해요.',
	},
] as const;

interface HomeCoachmarkTourProps {
	onComplete: () => void;
}

interface CoachmarkPosition {
	left: number;
	top: number;
	width: number;
	height: number;
	popupLeft: number;
	popupTop: number;
	arrowLeft: number;
	isAbove: boolean;
	shellLeft: number;
	shellWidth: number;
	radius: number;
}

export const HomeCoachmarkTour = ({ onComplete }: HomeCoachmarkTourProps) => {
	const { ref: shellRef } = useAppShell();

	const overlayRef = useRef<HTMLDivElement>(null);
	const popupRef = useRef<HTMLDivElement>(null);

	const maskId = useId();

	const [step, setStep] = useState(0);
	const [position, setPosition] = useState<CoachmarkPosition | null>(null);

	useLayoutEffect(() => {
		const shell = shellRef.current;
		if (!shell) return;

		const target = shell.querySelector<HTMLElement>(`[data-coachmark="${STEPS[step].target}"]`);
		if (!target || target.getClientRects().length === 0) {
			if (step === STEPS.length - 1) onComplete();
			else setStep(step + 1);
			return;
		}

		target.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });

		let frame = 0;
		let previousGeometry = '';
		const updatePosition = () => {
			if (!target.isConnected || target.getClientRects().length === 0) {
				setPosition(null);
				if (step === STEPS.length - 1) onComplete();
				else setStep(step + 1);
				return;
			}
			const rect = target.getBoundingClientRect();
			const shellRect = shell.getBoundingClientRect();
			const viewport = window.visualViewport;
			const viewportTop = viewport?.offsetTop ?? 0;
			const viewportBottom = viewportTop + (viewport?.height ?? window.innerHeight);
			const popupWidth = Math.min(248, shellRect.width - 32);
			const popupHeight = popupRef.current?.offsetHeight ?? 180;
			const geometry = [
				rect.left,
				rect.top,
				rect.width,
				rect.height,
				shellRect.left,
				shellRect.width,
				viewportTop,
				viewportBottom,
				popupHeight,
			].join(':');
			frame = window.requestAnimationFrame(updatePosition);
			if (geometry === previousGeometry) return;
			previousGeometry = geometry;
			const popupLeft = Math.max(
				shellRect.left + 16,
				Math.min(
					step === 2
						? rect.left + rect.width / 2 - 30
						: step === 3 || step === 5
							? shellRect.right - popupWidth - 16
							: shellRect.left + (shellRect.width - popupWidth) / 2,
					shellRect.right - popupWidth - 16,
				),
			);
			const prefersAbove = step !== 0 && step !== 3;
			const tabHighlightTop = rect.top - 8;
			const tabHighlightHeight = Math.min(rect.height + 16, viewportBottom - 4 - tabHighlightTop);
			const popupGap = step === 2 ? rect.top - tabHighlightTop + 20 : 24;
			const isAbove = prefersAbove
				? rect.top - popupHeight - popupGap >= viewportTop + 56
				: rect.bottom + popupHeight + 40 > viewportBottom;
			const popupTop = Math.max(
				viewportTop + 56,
				Math.min(
					isAbove ? rect.top - popupHeight - popupGap : rect.bottom + popupGap,
					viewportBottom - popupHeight - 16,
				),
			);
			const padding = step === 3 ? 0 : step === 0 ? 2.5 : 4;
			setPosition({
				left: step === 2 ? rect.left + rect.width / 2 - 39.1 : rect.left - padding,
				top: step === 2 ? tabHighlightTop : rect.top - padding,
				width: step === 2 ? 78.2 : rect.width + padding * 2,
				height: step === 2 ? tabHighlightHeight : rect.height + padding * 2,
				radius: step === 3 ? rect.width / 2 : 14,
				popupLeft,
				popupTop,
				arrowLeft: step === 2 || step === 4 ? 30 : step === 3 ? popupWidth - 30 : popupWidth / 2,
				isAbove,
				shellLeft: shellRect.left,
				shellWidth: shellRect.width,
			});
		};

		updatePosition();
		return () => window.cancelAnimationFrame(frame);
	}, [step, shellRef, onComplete]);

	const isPositioned = position !== null;
	useEffect(() => {
		if (!isPositioned) return;
		const overlay = overlayRef.current;
		if (!overlay) return;
		const previousFocus = document.activeElement;
		const siblings = Array.from(overlay.parentElement?.children ?? []).filter(
			(element): element is HTMLElement => element instanceof HTMLElement && element !== overlay,
		);
		const previousInert = siblings.map((element) => element.inert);
		for (const element of siblings) element.inert = true;
		overlay.querySelector('button')?.focus({ preventScroll: true });

		return () => {
			siblings.forEach((element, index) => {
				element.inert = previousInert[index];
			});
			if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
		};
	}, [isPositioned]);

	const handleNext = () => {
		if (step === STEPS.length - 1) onComplete();
		else setStep(step + 1);
	};

	return (
		<div
			ref={overlayRef}
			className="fixed inset-0 z-50"
			onPointerDown={(event) => {
				if (event.target !== event.currentTarget) return;
				event.preventDefault();
				overlayRef.current?.querySelector('button')?.focus({ preventScroll: true });
			}}
			onKeyDown={(event) => {
				if (event.key === 'Escape') onComplete();
				if (event.key !== 'Tab') return;
				const buttons = overlayRef.current?.querySelectorAll('button');
				if (!buttons?.length) return;
				const first = buttons[0];
				const last = buttons[buttons.length - 1];
				if (event.shiftKey && document.activeElement === first) {
					event.preventDefault();
					last.focus();
				} else if (!event.shiftKey && document.activeElement === last) {
					event.preventDefault();
					first.focus();
				}
			}}
		>
			{position && (
				<>
					<svg className="pointer-events-none absolute inset-0 size-full">
						<title>기능 안내 영역 강조</title>
						<defs>
							<mask id={maskId}>
								<rect width="100%" height="100%" fill="white" />
								<rect
									x={position.left}
									y={position.top}
									width={position.width}
									height={position.height}
									rx={position.radius}
									fill="black"
								/>
							</mask>
						</defs>
						<rect
							width="100%"
							height="100%"
							fill="black"
							fillOpacity="0.6"
							mask={`url(#${maskId})`}
						/>
						<rect
							x={position.left}
							y={position.top}
							width={position.width}
							height={position.height}
							rx={position.radius}
							fill="none"
							stroke="white"
							strokeWidth="2"
						/>
					</svg>
					<IconButton
						title="가이드 닫기"
						size="sm"
						className="absolute top-[max(16px,var(--safe-area-inset-top))] rounded-full bg-background-normal text-label-assistive"
						style={{
							left:
								step === 3
									? position.shellLeft + 16
									: position.shellLeft + position.shellWidth - 48,
						}}
						onClick={onComplete}
					>
						<XIcon />
					</IconButton>
				</>
			)}
			<div
				ref={popupRef}
				className="absolute w-62 max-w-[calc(100%_-_32px)] rounded-xl bg-white p-4 text-label-normal shadow-md"
				style={{
					visibility: position ? 'visible' : 'hidden',
					left: position?.popupLeft,
					top: position?.popupTop,
				}}
			>
				<span
					className={cn(
						'absolute h-2.5 w-5 bg-white [clip-path:polygon(0_100%,50%_0,100%_100%)]',
						position?.isAbove ? '-bottom-2.5 rotate-180' : '-top-2.5',
					)}
					style={{ left: (position?.arrowLeft ?? 30) - 10 }}
				/>
				<p className="mb-2 text-body2 text-label-tertiary">
					{step + 1}/{STEPS.length}
				</p>
				<p className="mb-1 font-semibold text-body2">{STEPS[step].title}</p>
				<p className="break-keep text-body2 text-label-subtle [overflow-wrap:break-word]">
					{STEPS[step].description}
				</p>
				<div className="mt-3 flex justify-end">
					<Button size="sm" onClick={handleNext}>
						{step === STEPS.length - 1 ? '시작하기' : '다음'}
					</Button>
				</div>
			</div>
		</div>
	);
};
