'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from '@dpm-core/shared';

import pendingSymbol from '@/assets/images/pending-symbol.svg';
import { SafeAreaAppLayout } from '@/components/app-layout';
import { markAwaitingApproval } from '@/lib/approval-welcome';

export default function PendingPage() {
	useEffect(() => {
		markAwaitingApproval();
	}, []);

	return (
		<SafeAreaAppLayout className="h-dvh bg-[linear-gradient(158.06deg,#FFFFFF_20.54%,#CFD9FF_60.84%,#E6F9FF_99%)]">
			<main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
				<Image src={pendingSymbol} alt="" priority />
				<div className="flex flex-col gap-4">
					<h1 className="bg-[linear-gradient(110.25deg,#5359D6_30.58%,#0D1A34_60.1%,#737EAE_77.43%)] bg-clip-text font-bold text-headline2 text-transparent tracking-[-0.44px]">
						운영진이 회원 정보를
						<br />
						검토하고 있어요
					</h1>
					<p className="bg-linear-to-r from-label-subtle to-[#7A98C2] bg-clip-text font-medium text-body1 text-transparent">
						승인이 완료되면 홈화면에 접속할 수 있어요
					</p>
				</div>
			</main>
			<div className="flex flex-col gap-2 px-4 pb-4">
				<Button variant="secondary" size="full" className="h-12 rounded-lg" asChild>
					<Link href="/my-page">마이페이지</Link>
				</Button>
			</div>
		</SafeAreaAppLayout>
	);
}
