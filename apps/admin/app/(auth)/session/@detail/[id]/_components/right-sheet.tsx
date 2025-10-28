'use client';

import { useParams, useRouter } from 'next/navigation';
import { type PropsWithChildren, useRef } from 'react';
import { Sheet, SheetContent } from '@dpm-core/shared';

export const RightSheet = ({ children }: PropsWithChildren) => {
	const router = useRouter();
	const params = useParams<{ id?: string }>();

	const sheetRef = useRef<HTMLDivElement>(null);

	return (
		<Sheet modal={false} open={!!params.id}>
			<SheetContent
				ref={sheetRef}
				className="w-full min-w-full border-line-normal shadow-none outline-none md:w-[600px] md:min-w-[600px] md:pt-[81px]"
				onPointerDownOutside={(event) => {
					const target = event.target as HTMLElement;
					if (target.closest('[data-no-close]')) {
						event.preventDefault();
					} else {
						router.back();
					}
				}}
			>
				{children}
			</SheetContent>
		</Sheet>
	);
};
