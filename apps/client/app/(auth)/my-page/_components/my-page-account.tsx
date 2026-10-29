'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import type {
	ApiErrorReponse,
	ConnectedMemberAccount,
	LinkableLoginMethod,
	LoginMethod,
} from '@dpm-core/api';
import {
	AppleLogo,
	Button,
	cn,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	KakaoLogo,
	toast,
} from '@dpm-core/shared';

import { CLARITY_ACTION_ID } from '@/constants/clarity';
import { getAccountLinkRedirectUri } from '@/lib/env';
import { useClarity } from '@/providers/client-clarity-adapter';
import {
	startAccountLinkMutationOptions,
	unlinkAccountMutationOptions,
} from '@/remotes/mutations/member';
import { getMyAccountsQuery } from '@/remotes/queries/member';

import { MyPageBox } from './my-page-box';

const LINKABLE_PROVIDERS: LinkableLoginMethod[] = ['KAKAO', 'APPLE'];

const LOGIN_METHOD_LABEL: Record<LoginMethod, string> = {
	KAKAO: '카카오 계정',
	APPLE: '애플 계정',
	EMAIL: '이메일 로그인',
};

function getSocialIcon(method: LoginMethod) {
	if (method === 'KAKAO') {
		return { icon: <KakaoLogo className="h-2.5 w-3" />, background: 'bg-[#FEE500]' };
	}
	if (method === 'APPLE') {
		return { icon: <AppleLogo className="size-3 text-white" />, background: 'bg-[#1F2937]' };
	}
	return null;
}

interface MyPageAccountProps {
	accounts: ConnectedMemberAccount[];
}

/** 계정 정보. 연결된 카카오·애플·이메일 로그인 수단을 보여주고, 카카오·애플은 연동·해제할 수 있다. */
export const MyPageAccount = ({ accounts }: MyPageAccountProps) => {
	const queryClient = useQueryClient();
	const { track } = useClarity();
	const [unlinkTarget, setUnlinkTarget] = useState<ConnectedMemberAccount | null>(null);

	const { mutate: startLink, isPending: isLinking } = useMutation(
		startAccountLinkMutationOptions({
			onSuccess: (res) => {
				window.location.href = res.data.authorizationUrl;
			},
			onError: () => toast.error('계정 연동을 시작하지 못했어요.'),
		}),
	);

	const { mutate: unlink, isPending: isUnlinking } = useMutation(
		unlinkAccountMutationOptions({
			onSuccess: () => {
				setUnlinkTarget(null);
				queryClient.invalidateQueries({ queryKey: getMyAccountsQuery.queryKey });
				toast.success('계정 연동이 해제되었어요.');
			},
			onError: async (error) => {
				const message =
					error instanceof HTTPError
						? ((await error.response.json().catch(() => null)) as ApiErrorReponse | null)?.message
						: null;
				toast.error(message ?? '계정 연동 해제에 실패했어요.');
			},
		}),
	);

	const linkedMethods = new Set(accounts.map((account) => account.loginMethod));
	const unlinkedProviders = LINKABLE_PROVIDERS.filter((provider) => !linkedMethods.has(provider));

	return (
		<MyPageBox className="flex flex-col gap-2">
			<p className="font-semibold text-body2 text-label-assistive">계정 정보</p>
			<div className="flex flex-col gap-2">
				{accounts.map((account) => (
					<AccountRow
						key={account.accountId}
						method={account.loginMethod}
						label={account.email ?? LOGIN_METHOD_LABEL[account.loginMethod]}
					>
						{account.loginMethod !== 'EMAIL' && (
							<Button
								variant="assistive"
								size="sm"
								className="text-body2 text-label-subtle"
								disabled={!account.unlinkAllowed || isUnlinking}
								onClick={() => setUnlinkTarget(account)}
							>
								해제
							</Button>
						)}
					</AccountRow>
				))}
				{unlinkedProviders.map((provider) => (
					<AccountRow key={provider} method={provider} label={LOGIN_METHOD_LABEL[provider]}>
						<Button
							variant="secondary"
							size="sm"
							className="text-body2"
							disabled={isLinking}
							onClick={() => {
								track(CLARITY_ACTION_ID.MY_PAGE.ACCOUNT_LINK_CLICK);
								startLink({ provider, redirectUri: getAccountLinkRedirectUri(provider) });
							}}
						>
							연동
						</Button>
					</AccountRow>
				))}
			</div>

			<Dialog open={unlinkTarget != null} onOpenChange={(open) => !open && setUnlinkTarget(null)}>
				<DialogContent showCloseButton={false}>
					<DialogTitle className="sr-only">계정 연동 해제</DialogTitle>
					<DialogHeader className="text-left font-bold text-title1">
						계정 연동을 해제할까요?
					</DialogHeader>
					<p className="text-body1 text-label-subtle">
						해제하면 이 계정으로는 다시 로그인할 수 없고, 다시 로그인하면 신규 가입 절차로 이동해요.
					</p>
					<DialogFooter>
						<Button
							className="flex-1"
							variant="assistive"
							size="lg"
							onClick={() => setUnlinkTarget(null)}
						>
							취소
						</Button>
						<Button
							className="flex-1"
							variant="danger"
							size="lg"
							loading={isUnlinking}
							onClick={() => {
								if (!unlinkTarget) return;
								track(CLARITY_ACTION_ID.MY_PAGE.ACCOUNT_UNLINK_CONFIRM);
								unlink(unlinkTarget.accountId);
							}}
						>
							해제
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</MyPageBox>
	);
};

const AccountRow = ({
	method,
	label,
	children,
}: {
	method: LoginMethod;
	label: string;
	children?: ReactNode;
}) => {
	const socialIcon = getSocialIcon(method);

	return (
		<div className={cn('flex items-center justify-between gap-2', children != null && 'h-9')}>
			<p className="flex min-w-0 flex-1 gap-2 font-medium text-body2 text-label-subtle">
				{socialIcon != null ? (
					<span
						className={cn(
							'inline-grid aspect-square w-5 shrink-0 place-items-center rounded-full',
							socialIcon.background,
						)}
					>
						{socialIcon.icon}
					</span>
				) : null}
				<span className="min-w-0 truncate">{label}</span>
			</p>
			{children != null && <div className="shrink-0">{children}</div>}
		</div>
	);
};
