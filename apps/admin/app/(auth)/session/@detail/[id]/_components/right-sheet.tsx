'use client';

import { useParams, useRouter } from 'next/navigation';
import { type PropsWithChildren, useRef } from 'react';
import { Sheet, SheetContent } from '@dpm-core/shared';

export const RightSheet = ({ children }: PropsWithChildren) => {
	const router = useRouter();
	const params = useParams<{ id?: string }>();

	const lastId = useRef<string | undefined>(undefined);

	const handleClose = () => {
		console.log(lastId.current);
		console.log(params.id);
		if (lastId.current === params.id) return;
		router.back();
	};

	// ✅ 매 렌더마다 현재 id 저장
	if (params.id && lastId.current !== params.id) {
		lastId.current = params.id;
	}

	return (
		<Sheet modal={false} open={!!params.id} onOpenChange={handleClose}>
			<SheetContent className="w-full min-w-full border-line-normal shadow-none md:w-[600px] md:min-w-[600px] md:pt-[81px]">
				{children}
			</SheetContent>
		</Sheet>
	);
};
