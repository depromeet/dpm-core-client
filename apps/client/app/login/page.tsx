import { DpmText } from '@dpm-core/shared';
import { LoginButton } from '@/components/login-button';
import { CoreLogo } from '@/components/lotties/core-logo';

const LoginPage = () => {
	return (
		<div className="bg-background-subtle min-h-dvh flex flex-col justify-center gap-y-10">
			<div className="mx-auto text-center flex flex-col gap-y-10">
				<div className="flex flex-col items-center gap-y-4">
					<CoreLogo />
					<div className="uppercase text-headline1 font-semibold text-label-normal flex mx-auto gap-x-2.5 items-start">
						<DpmText className="text-gray-800 w-fit" />
					</div>
				</div>
				<p>
					출석, 번개, 커피챗까지
					<br />
					17기의 모든 네트워킹을 코어에서 서포트합니다
				</p>
				<LoginButton
					variant="none"
					className="bg-[#FEE500] rounded-xl px-[15px] py-3.5 font-medium justify-between h-auto leading-1"
				/>
			</div>
		</div>
	);
};

export default LoginPage;
