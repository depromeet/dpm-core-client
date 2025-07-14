import Banner from '@/apps/admin/assets/images/login-banner.webp';
import { LoginButton } from '@dpm-core/shared';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

const LoginPage = () => {
	return (
		<div className="bg-primary-extralight min-h-dvh flex flex-col justify-center gap-y-10">
			<div className="mx-auto text-center flex flex-col gap-y-10">
				<h1 className="uppercase text-headline1 font-semibold text-label-normal">DPM CORE</h1>
				<p>
					출석, 번개, 커피챗까지
					<br />
					17기의 모든 네트워킹을 코어에서 서포트합니다
				</p>
				<LoginButton
					variant="assistive"
					className="bg-[#FEE500] rounded-xl px-[15px] py-3.5 font-medium h-auto leading-1"
				/>
			</div>
			<div className="relative aspect-[300/250] w-4/5 mx-auto">
				<Image
					src={Banner}
					alt="login-banner"
					fill
					placeholder="blur"
					blurDataURL={Banner.blurDataURL}
				/>
			</div>
		</div>
	);
};

export default LoginPage;
