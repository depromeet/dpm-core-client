import Image from 'next/image';

import dpmLogo from '@/assets/images/dpm-logo.svg';
import { SafeAreaAppLayout } from '@/components/app-layout';
import { AppleLoginButton } from '@/components/apple-login-button';
import { EmailLoginButton } from '@/components/email-login-button';
import { LoginButton } from '@/components/login-button';
import { RecentLoginBadge } from '@/components/recent-login-badge';

const LoginPage = () => {
	return (
		<SafeAreaAppLayout className="h-dvh bg-background-subtle">
			<div className="flex flex-col gap-y-4.5 px-4 pt-20">
				<Image src={dpmLogo} alt="DPM" priority className="h-auto w-31" />
				<p className="font-normal text-body1 text-label-subtle">
					출석부터 회식까지,
					<br />
					디프만을 더 쉽게
				</p>
			</div>
			{/* TODO: 대표 그래픽 또는 온보딩 영역 (디자인 확정 후 반영) */}
			<div className="flex-1" />
			<div className="flex flex-col items-center gap-y-5 bg-linear-to-b from-white/0 to-18% to-white px-4 py-8">
				<div className="relative w-full">
					<LoginButton
						size="full"
						variant="none"
						className="h-12.5 justify-center rounded-xl bg-[#FEE500] px-3.75 py-3.5 font-medium text-body1 leading-1"
					/>
					<RecentLoginBadge />
				</div>
				<div className="flex flex-col items-center gap-y-3">
					<p className="font-medium text-black/40 text-caption1">다른 방법으로 시작하기</p>
					<div className="flex items-center gap-x-6">
						<AppleLoginButton />
						<EmailLoginButton />
					</div>
				</div>
			</div>
		</SafeAreaAppLayout>
	);
};

export default LoginPage;
