import Image from 'next/image';
import { Suspense } from 'react';

import bgEllipse from '@/assets/images/login-bg-ellipse.svg';
import bgGraphic from '@/assets/images/login-bg-graphic.svg';
import { SafeAreaAppLayout } from '@/components/app-layout';
import { AppleLoginButton } from '@/components/apple-login-button';
import { EmailLoginButton } from '@/components/email-login-button';
import { LoginButton } from '@/components/login-button';
import { LoginErrorToast } from '@/components/login-error-toast';
import { RecentLoginBadge } from '@/components/recent-login-badge';
import { ReviewLoginLogo } from '@/components/review-login-logo';

const LoginPage = () => {
	return (
		<SafeAreaAppLayout
			hasBottomTabBar
			className="relative h-dvh overflow-hidden bg-[linear-gradient(150.15deg,#FFFFFF_5.91%,#CFD9FF_42.11%,#E6F9FF_70.04%)] bg-gray-50"
		>
			<Suspense>
				<LoginErrorToast />
			</Suspense>
			<div aria-hidden className="pointer-events-none absolute inset-0">
				<Image
					src={bgEllipse}
					alt=""
					className="-scale-y-100 absolute top-[-127.36px] left-[-162.55px] max-w-none rotate-[-154.44deg]"
				/>
				<Image
					src={bgGraphic}
					alt=""
					className="absolute top-[310.7px] left-[133.85px] max-w-none rotate-[11.03deg] mix-blend-color-dodge"
				/>
			</div>
			<div className="relative flex flex-col gap-y-4.5 px-4 pt-20">
				<ReviewLoginLogo />
				<p className="font-normal text-body1 text-label-strong">
					출석부터 공지 확인까지,
					<br />
					디프만을 더 쉽게
				</p>
			</div>
			<div className="flex-1" />
			<div className="relative flex flex-col items-center gap-y-5 bg-linear-to-b from-white/0 to-16% to-white px-4 pt-8 pb-[calc(var(--safe-area-inset-bottom)+2rem)]">
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
