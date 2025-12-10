'use client';

import { useParams, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { Button, Sheet, SheetContent, XCircle } from '@dpm-core/shared';

interface SessionSheetProps {
	children?: ReactNode;
}

export const SessionSheet = (props: SessionSheetProps) => {
	const { children } = props;

	const params = useParams<{ id: string }>();
	const isOpen = !!params.id;

	return (
		<Sheet modal={false} open={isOpen}>
			<SheetContent className="w-full min-w-full gap-0 border-line-normal shadow-[0_-4px_21.1px_0_rgba(0,0,0,0.12)] outline-none max-md:data-[state=closed]:animate-none max-md:data-[state=open]:animate-none md:w-[600px] md:min-w-[600px]">
				{children}
			</SheetContent>
		</Sheet>
	);
};

export const SessionSheetCloseButton = () => {
	const router = useRouter();

	const redirectToSession = () => {
		router.back();
	};

	return (
		<Button variant="none" size="none" onClick={() => redirectToSession()}>
			<XCircle />
		</Button>
	);
};
