import { MailIcon } from 'lucide-react';
import type { LoginMethod } from '@dpm-core/api';
import { AppleLogo, cn, KakaoLogo } from '@dpm-core/shared';

const LOGIN_METHOD_ICON: Record<LoginMethod, { icon: React.ReactNode; background: string }> = {
	KAKAO: { icon: <KakaoLogo className="h-2.5 w-3" />, background: 'bg-[#FEE500]' },
	APPLE: { icon: <AppleLogo className="size-3 text-white" />, background: 'bg-[#1F2937]' },
	EMAIL: {
		icon: <MailIcon className="size-3 text-label-assistive" strokeWidth={1.5} />,
		background: 'bg-background-strong',
	},
};

const LOGIN_METHOD_LABEL: Record<LoginMethod, string> = {
	KAKAO: '카카오로 가입',
	APPLE: '애플로 가입',
	EMAIL: '이메일로 가입',
};

interface MemberLoginMethodIconProps {
	loginMethod: LoginMethod | null | undefined;
	className?: string;
}

/** 멤버 관리 테이블에서 대표 로그인 수단을 보여주는 작은 아이콘. 연결 정보가 없으면 아무것도 그리지 않는다. */
export const MemberLoginMethodIcon = ({ loginMethod, className }: MemberLoginMethodIconProps) => {
	if (!loginMethod) return null;

	const { icon, background } = LOGIN_METHOD_ICON[loginMethod];

	return (
		<span
			title={LOGIN_METHOD_LABEL[loginMethod]}
			className={cn(
				'inline-grid aspect-square w-5 shrink-0 place-items-center rounded-full',
				background,
				className,
			)}
		>
			{icon}
		</span>
	);
};
