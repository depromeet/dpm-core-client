'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { auth } from '@dpm-core/api';
import { Form, toast } from '@dpm-core/shared';

import { FormEmail } from './form/form-email';
import { FormLoginButton } from './form/form-login-button';
import { FormPassword } from './form/form-password';

const loginEmailSchema = z.object({
	email: z.email('이메일 형식으로 입력해주세요'),
	password: z.string().min(1, '필수 입력 값입니다.'),
});

type LoginEmailSchema = z.infer<typeof loginEmailSchema>;

const FORM_ID = 'login-email-form';

export const LoginEamilForm = () => {
	const form = useForm<LoginEmailSchema>({
		resolver: zodResolver(loginEmailSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const router = useRouter();

	const handleLoginEmail = async (formData: LoginEmailSchema) => {
		try {
			await auth.login(formData);
			router.replace('/');
		} catch {
			toast.error('이메일 또는 비밀번호가 일치하지 않습니다.');
		}
	};

	const isDisabled = form.formState.isSubmitting;

	return (
		<Form {...form}>
			<form
				id={FORM_ID}
				onSubmit={form.handleSubmit(handleLoginEmail)}
				className="flex flex-col gap-4 pb-10"
			>
				<FormEmail />
				<FormPassword />
				<FormLoginButton form={FORM_ID} disabled={isDisabled} />
			</form>
		</Form>
	);
};
