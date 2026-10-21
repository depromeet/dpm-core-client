import Image from 'next/image';
import { Suspense } from 'react';

import dpmLogo from '@/assets/images/dpm-logo.svg';
import bgEllipse from '@/assets/images/login-bg-ellipse.svg';
import bgGraphic from '@/assets/images/login-bg-graphic.svg';
import { SafeAreaAppLayout } from '@/components/app-layout';
import { AppleLoginButton } from '@/components/apple-login-button';
import { LoginButton } from '@/components/login-button';
import { LoginErrorToast } from '@/components/login-error-toast';
import { LoginReturnTo } from '@/components/login-return-to';
import { RecentLoginBadge } from '@/components/recent-login-badge';

const LoginPage = async ({
	searchParams,
}: {
	searchParams: Promise<{ returnTo?: string | string[]; error?: string | string[] }>;
}) => {
	const { returnTo, error } = await searchParams;
	const returnToValue = Array.isArray(returnTo) ? returnTo[0] : returnTo;
	const hasError = Array.isArray(error) ? error.length > 0 : Boolean(error);

	return (
		<SafeAreaAppLayout
			hasBottomTabBar
			className="relative h-dvh overflow-hidden bg-[linear-gradient(150.15deg,#FFFFFF_5.91%,#CFD9FF_42.11%,#E6F9FF_70.04%)] bg-gray-50"
		>
			<LoginReturnTo returnTo={returnToValue} preserveExisting={hasError} />
			<Suspense>
				<LoginErrorToast />
			</Suspense>
			<div className="relative flex h-full w-full max-w-[512px] flex-col">
				<div aria-hidden className="pointer-events-none absolute inset-0">
					<Image
						src={bgEllipse}
						alt=""
						className="-scale-y-100 absolute top-[-127.36px] right-[37.19px] max-w-none rotate-[-154.44deg]"
					/>
					<Image
						src={bgGraphic}
						alt=""
						className="absolute top-[310.7px] right-[-10.27px] max-w-none rotate-[11.03deg] mix-blend-color-dodge"
					/>
				</div>
				<div className="relative flex flex-col gap-y-4.5 px-4 pt-20">
					<Image src={dpmLogo} alt="DPM" priority className="h-auto w-31" />
					<p className="font-normal text-body1 text-label-strong">
						출석부터 공지 확인까지,
						<br />
						디프만을 더 쉽게
					</p>
				</div>
				<div className="flex-1" />
				<div className="relative flex flex-col gap-y-2.5 bg-linear-to-b from-white/0 to-16% to-white px-4 pt-8 pb-[calc(var(--safe-area-inset-bottom)+2rem)]">
					<div className="relative w-full">
						<LoginButton
							size="full"
							variant="none"
							className="h-12.5 justify-center rounded-xl bg-[#FEE500] px-3.75 py-3.5 font-medium text-body1 leading-1"
						/>
						<RecentLoginBadge method="KAKAO" />
					</div>
					<div className="relative w-full">
						<AppleLoginButton className="h-12.5 justify-center rounded-xl bg-black px-3.75 py-3.5 font-medium text-body1 text-white leading-1" />
						<RecentLoginBadge method="APPLE" />
					</div>
				</div>
			</div>
		</SafeAreaAppLayout>
	);
};

export default LoginPage;
