'use client';

import { useRouter } from 'next/navigation';
import { MailIcon } from 'lucide-react';
import { cn } from '@dpm-core/shared';

import { Pressable } from './motion';

interface EmailLoginButtonProps {
	className?: string;
}

const EmailLoginButton = ({ className }: EmailLoginButtonProps) => {
	const router = useRouter();

	const handleLoginEmail = () => {
		router.push('/login/email');
	};

	return (
		<Pressable
			type="button"
			variant="none"
			onClick={handleLoginEmail}
			className={cn(
				'h-auto gap-2 rounded-xl border border-line-normal bg-white px-[15px] py-3.5 font-medium text-sm leading-1',
				className,
			)}
		>
			<MailIcon className="size-5 text-label-subtle" strokeWidth={1.5} />
			<p className="flex-1 text-[#000000] opacity-85">이메일로 로그인</p>
		</Pressable>
	);
};

export { EmailLoginButton };
