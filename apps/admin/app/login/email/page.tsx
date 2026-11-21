import { LoginEmailForm } from './_components/login-email-form';

export const dynamic = 'force-dynamic';

const EmailLoginPage = () => {
	return (
		<section className="flex w-full flex-col items-center justify-center gap-10 px-10 text-center">
			<h1 className="text-headline1 font-semibold text-label-normal">이메일 로그인</h1>
			<LoginEmailForm />
		</section>
	);
};

export default EmailLoginPage;
