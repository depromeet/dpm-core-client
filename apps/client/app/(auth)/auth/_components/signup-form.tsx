'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Form, toast } from '@dpm-core/shared';

import { approveWhitelistMutationOptions } from '@/remotes/mutations/member';

import { FormEmail } from './form/form-email';
import { FormName } from './form/form-name';
import { SignupButton } from './form/form-signup-button';

const signupSchema = z.object({
	name: z.string().min(1, '필수 입력 값입니다.'),
	signupEmail: z.email('이메일 형식으로 입력해주세요').min(1, '필수 입력 값입니다.'),
});

type SignupSchema = z.infer<typeof signupSchema>;

const FORM_ID = 'signup-form';

export const SignupForm = () => {
	const form = useForm<SignupSchema>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			name: '',
			signupEmail: '',
		},
	});

	const router = useRouter();

	const { mutate: approveWhitelist, isPending } = useMutation(
		approveWhitelistMutationOptions({
			onSuccess: () => {
				router.replace('/');
			},
			onError: () => {
				toast.error('이메일을 다시 확인해 주세요.');
			},
		}),
	);

	const handleSubmitSignup = (formData: SignupSchema) => {
		approveWhitelist(formData);
	};

	const isDisabled = !form.formState.isValid || form.formState.isSubmitting || isPending;

	return (
		<Form {...form}>
			<form
				id={FORM_ID}
				onSubmit={form.handleSubmit(handleSubmitSignup)}
				className="flex flex-col gap-4 pb-10"
			>
				<FormName />
				<FormEmail />
				<SignupButton form={FORM_ID} disabled={isDisabled} />
			</form>
		</Form>
	);
};
