'use client';

import { useRouter } from 'next/navigation';
import { Button, CircleAlert } from '@dpm-core/shared';

import { SafeAreaAppLayout } from '@/components/app-layout';

export default function RejectedPage() {
	const router = useRouter();

	return (
		<SafeAreaAppLayout className="h-dvh bg-white">
			<main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
				<CircleAlert size={42} />
				<div className="flex flex-col gap-4">
					<h1 className="font-bold text-headline2 text-label-normal tracking-[-0.44px]">
						가입이 반려되었어요
					</h1>
					<p className="text-body1 text-label-subtle leading-[1.5]">
						입력한 개인정보가 지원 시 개인정보와
						<br />
						일치하지 않아 반려되었을 수 있어요
						<br />
						<br />
						지속적으로 가입에 실패할 경우
						<br />
						운영진에게 문의해주세요
					</p>
				</div>
			</main>
			<div className="flex flex-col gap-2 px-4 pb-4">
				<Button
					variant="secondary"
					size="full"
					className="h-12 rounded-lg"
					onClick={() => router.push('/rejected/edit')}
				>
					개인정보 수정하기
				</Button>
			</div>
		</SafeAreaAppLayout>
	);
}
