import { DpmText } from '@dpm-core/shared';

import { AppleLoginButton } from '@/components/apple-login-button';
import { EmailLoginButton } from '@/components/email-login-button';
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
				<p className="font-medium text-label-subtle">
					출석부터 회식까지
					<br />
					디프만을 더 쉽게
				</p>
				<div className="flex flex-col items-center gap-3">
					<AppleLoginButton
						variant="none"
						size="full"
						className="h-auto min-w-65 justify-between rounded-xl bg-black px-4 py-3.5 font-medium text-white leading-1"
					/>
					<LoginButton
						size="full"
						variant="none"
						className="h-auto min-w-65 justify-between rounded-xl bg-[#FEE500] px-4 py-3.5 font-medium leading-1"
					/>
					<EmailLoginButton />
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
