'use client';

import type React from 'react';
import { Monitor } from 'lucide-react';
import { useIsMobile } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';

/**
 * 멤버 관리는 여러 컬럼을 한눈에 보고 고치는 화면이라 데스크톱에서만 쓴다.
 * 모바일에서는 기능을 반쯤 보여주는 대신 안내만 한다.
 */
export const MemberDesktopOnlyGuard = ({ children }: { children: React.ReactNode }) => {
	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<>
				<AppHeader title="멤버 관리" />
				<div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
					<Monitor className="size-12 text-label-assistive" strokeWidth={1.5} />
					<p className="font-semibold text-body1 text-label-normal">
						멤버 관리는 PC에서 이용할 수 있어요
					</p>
					<p className="font-medium text-body2 text-label-assistive">
						더 넓은 화면에서 멤버 정보를 확인하고 수정해 주세요.
					</p>
				</div>
			</>
		);
	}

	return <>{children}</>;
};
