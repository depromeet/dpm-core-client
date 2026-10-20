'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { auth } from '@dpm-core/api';
import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	toast,
} from '@dpm-core/shared';

const loginEmailSchema = z.object({
	email: z.email('이메일 형식으로 입력해주세요'),
	password: z.string().min(1, '필수 입력 값입니다.'),
});

type LoginEmailSchema = z.infer<typeof loginEmailSchema>;

export const LoginEmailForm = () => {
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
				onSubmit={form.handleSubmit(handleLoginEmail)}
				className="flex w-full flex-col gap-4 text-left"
			>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>이메일</FormLabel>
							<FormControl>
								<Input variant="line" type="text" placeholder="이메일을 입력해주세요" {...field} />
							</FormControl>
							<div className="relative min-h-4">
								<FormMessage className="text-red-400" />
							</div>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>비밀번호</FormLabel>
							<FormControl>
								<Input
									variant="line"
									type="password"
									placeholder="비밀번호를 입력해주세요"
									{...field}
								/>
							</FormControl>
							<div className="relative min-h-4">
								<FormMessage className="text-red-400" />
							</div>
						</FormItem>
					)}
				/>
				<Button type="submit" variant="primary" size="full" disabled={isDisabled}>
					로그인
				</Button>
			</form>
		</Form>
	);
};
