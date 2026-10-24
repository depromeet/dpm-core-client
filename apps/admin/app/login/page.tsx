import { DpmText } from '@dpm-core/shared';

import { EmailLoginButton } from '@/components/email-login-button';
import { LoginButton } from '@/components/login-button';
import { CoreLogo } from '@/components/lotties/core-logo';

export const dynamic = 'force-dynamic';

const LoginPage = () => {
	return (
		<section className="flex flex-col items-center justify-center gap-10 text-center">
			<div className="mx-auto flex flex-col gap-y-10">
				<div className="flex flex-col items-center gap-y-4.5">
					<CoreLogo />
					<div className="relative mx-auto flex gap-x-2.5 font-semibold text-headline1 text-label-normal uppercase">
						<DpmText className="w-fit text-gray-800" />
					</div>
				</div>
				<p className="font-medium text-body2 text-label-subtle">
					출석, 번개, 커피챗까지
					<br />
					19기의 모든 네트워킹을 코어에서 서포트합니다
				</p>
				<div className="flex flex-col">
					<LoginButton
						variant="none"
						className="h-auto rounded-xl bg-[#FEE500] px-[15px] py-3.5 font-medium leading-1"
					/>
					<EmailLoginButton className="mt-2" />
				</div>
			</div>
		</section>
	);
};
export default LoginPage;
