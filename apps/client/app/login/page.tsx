import { DpmText } from '@dpm-core/shared';

import { LoginButton } from '@/components/login-button';
import { CoreLogo } from '@/components/lotties/core-logo';

const LoginPage = () => {
	return (
		<div className="flex min-h-dvh flex-col justify-center gap-y-10 bg-background-subtle">
			<div className="mx-auto flex flex-col gap-y-10 text-center">
				<div className="flex flex-col items-center gap-y-4">
					<CoreLogo />
					<div className="mx-auto flex items-start gap-x-2.5 font-semibold text-headline1 text-label-normal uppercase">
						<DpmText className="w-fit text-gray-800" />
					</div>
				</div>
				<p>
					출석, 번개, 커피챗까지
					<br />
					17기의 모든 네트워킹을 코어에서 서포트합니다
				</p>
				<LoginButton
					variant="none"
					className="h-auto justify-between rounded-xl bg-[#FEE500] px-[15px] py-3.5 font-medium leading-1"
				/>
			</div>
		</div>
	);
};

export default LoginPage;
