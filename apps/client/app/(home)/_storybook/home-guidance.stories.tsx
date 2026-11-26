import { useCallback, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { expect, type UserEventObject, waitFor, within } from 'storybook/test';
import type { MemberProfileUpdateRequest } from '@dpm-core/api';
import { useAppShell } from '@dpm-core/shared';

import { showKakaoLoginToast } from '@/components/last-login-recorder';

import preview from '../../../.storybook/preview';
import { AppleProfileSetupForm } from '../_components/apple-profile-setup-sheet';
import { HomeCoachmarkTour } from '../_components/home-coachmark-tour';
import { HOME_CLOCK, homeResponse } from './home-cases';
import { HomePreview } from './home-preview';

interface ProfileSetupCaseProps {
	result?: 'success' | 'failure' | 'pending';
	keyboardOpen?: boolean;
}

const PROFILE_TITLE = '활동에 필요한 정보를 입력해주세요.';
const PROFILE_NAME_PLACEHOLDER = '이름을 입력해주세요';
const pendingSave = new Promise<never>(() => undefined);

const ProfileSetupCase = ({ result = 'success', keyboardOpen }: ProfileSetupCaseProps) => {
	const { mutate, isPending } = useMutation({
		mutationFn: (profile: MemberProfileUpdateRequest) => {
			if (result === 'pending') return pendingSave;
			if (result === 'failure') return Promise.reject(new Error('프로필 저장 실패'));

			return Promise.resolve(homeResponse({ ...profile, profileCompletionRequired: false }));
		},
	});
	const keyboardHeight = Math.floor(window.innerHeight * 0.4);

	return (
		<AppleProfileSetupForm
			isSetupRequired
			isPending={isPending}
			saveProfile={mutate}
			viewport={
				keyboardOpen
					? { keyboardHeight, viewportHeight: window.innerHeight - keyboardHeight }
					: undefined
			}
		/>
	);
};

interface HomeTourCaseProps {
	requireAttendanceTarget: boolean;
}

const HomeTourCase = ({ requireAttendanceTarget }: HomeTourCaseProps) => {
	const { ref: shellRef } = useAppShell();
	const [status, setStatus] = useState<'waiting' | 'active' | 'complete'>('waiting');
	const complete = useCallback(() => setStatus('complete'), []);

	useEffect(() => {
		const shell = shellRef.current;
		if (!shell || status !== 'waiting') return;

		const startWhenRendered = () => {
			const sessionTarget = shell.querySelector('[data-coachmark="session-info"]');
			const attendanceTarget = shell.querySelector('[data-coachmark="attendance-check"]');
			if (sessionTarget && (!requireAttendanceTarget || attendanceTarget)) setStatus('active');
		};
		const observer = new MutationObserver(startWhenRendered);
		observer.observe(shell, { childList: true, subtree: true });
		startWhenRendered();
		return () => observer.disconnect();
	}, [requireAttendanceTarget, shellRef, status]);

	return status === 'active' ? <HomeCoachmarkTour onComplete={complete} /> : null;
};

const getProfileForm = async (canvasElement: HTMLElement) => {
	const body = within(canvasElement.ownerDocument.body);
	return within(await body.findByRole('dialog', { name: PROFILE_TITLE }));
};

interface PlayContext {
	canvasElement: HTMLElement;
	userEvent: UserEventObject;
}

const fillProfile = async ({ canvasElement, userEvent }: PlayContext) => {
	const form = await getProfileForm(canvasElement);
	await userEvent.type(form.getByPlaceholderText(PROFILE_NAME_PLACEHOLDER), '김디퍼');
	await userEvent.click(form.getByText('Web'));
	await expect(form.getByRole('radio', { name: 'Web' })).toBeChecked();
	return form;
};

const submitProfile = async (context: PlayContext) => {
	const form = await fillProfile(context);
	await context.userEvent.click(form.getByRole('button', { name: '저장하기' }));
	return form;
};

const fillProfileForm = async (context: PlayContext) => {
	const form = await fillProfile(context);
	await expect(form.getByRole('button', { name: '저장하기' })).toBeEnabled();
};

const showProfileSaving = async (context: PlayContext) => {
	const form = await submitProfile(context);
	await expect(await form.findByRole('button', { name: '저장 중...' })).toBeDisabled();
};

const saveProfile = async (context: PlayContext) => {
	await submitProfile(context);
	const body = within(context.canvasElement.ownerDocument.body);
	await expect(await body.findByText('프로필이 설정되었어요.')).toBeVisible();
};

const showProfileSaveError = async (context: PlayContext) => {
	const form = await submitProfile(context);
	const body = within(context.canvasElement.ownerDocument.body);
	await expect(await body.findByText('프로필 설정에 실패했어요. 다시 시도해주세요.')).toBeVisible();
	await expect(form.getByRole('button', { name: '저장하기' })).toBeEnabled();
};

const renderProfile = (result?: ProfileSetupCaseProps['result']) => () => (
	<HomePreview afterTabBar={<ProfileSetupCase result={result} />} />
);

const completeGuide =
	(totalSteps: number) =>
	async ({ canvasElement, userEvent }: PlayContext) => {
		const canvas = within(canvasElement);
		for (let step = 1; step < totalSteps; step += 1) {
			await waitFor(() => expect(canvas.getByText(`${step}/${totalSteps}`)).toBeVisible());
			await userEvent.click(await canvas.findByRole('button', { name: '다음' }));
		}
		await waitFor(() => expect(canvas.getByText(`${totalSteps}/${totalSteps}`)).toBeVisible());
		await userEvent.click(await canvas.findByRole('button', { name: '시작하기' }));
		await waitFor(() =>
			expect(canvas.queryByText(`${totalSteps}/${totalSteps}`)).not.toBeInTheDocument(),
		);
	};

const meta = preview.meta({
	title: 'Cases/홈/프로필 및 안내',
	component: HomePreview,
});

export const ProfileEmpty = meta.story({
	name: '프로필 시트 · 입력 전',
	render: renderProfile(),
	play: async ({ canvasElement }) => {
		const form = await getProfileForm(canvasElement);
		await expect(form.getByRole('button', { name: '저장하기' })).toBeDisabled();
	},
});

export const ProfileReady = meta.story({
	name: '프로필 시트 · 입력 완료',
	tags: ['!dev'],
	render: renderProfile(),
	play: fillProfileForm,
});

export const ProfileSaving = meta.story({
	name: '프로필 시트 · 저장 중',
	tags: ['!dev'],
	render: renderProfile('pending'),
	play: showProfileSaving,
});

export const ProfileSaved = meta.story({
	name: '프로필 시트 · 저장 완료',
	tags: ['!dev'],
	render: renderProfile(),
	play: saveProfile,
});

export const ProfileSaveFailed = meta.story({
	name: '프로필 시트 · 저장 실패',
	tags: ['!dev'],
	render: renderProfile('failure'),
	play: showProfileSaveError,
});

export const ProfileKeyboard = meta.story({
	name: '프로필 시트 · 키보드 열린 상태',
	render: () => <HomePreview afterTabBar={<ProfileSetupCase keyboardOpen />} />,
	play: async ({ canvasElement, userEvent }) => {
		const form = await getProfileForm(canvasElement);
		const name = form.getByPlaceholderText(PROFILE_NAME_PLACEHOLDER);
		await userEvent.click(name);
		await expect(name).toHaveFocus();
		await expect(form.queryByRole('button', { name: '저장하기' })).not.toBeInTheDocument();
	},
});

export const FirstGuide = meta.story({
	name: '첫 가이드 · 전체 단계',
	render: () => (
		<HomePreview
			scenario={{ now: HOME_CLOCK.attendanceOpen }}
			afterTabBar={<HomeTourCase requireAttendanceTarget />}
		/>
	),
});

export const GuideWithoutAttendance = meta.story({
	name: '첫 가이드 · 출석 버튼 생략',
	render: () => (
		<HomePreview
			scenario={{ now: HOME_CLOCK.beforeAttendance }}
			afterTabBar={<HomeTourCase requireAttendanceTarget={false} />}
		/>
	),
});

export const KakaoLoginToast = meta.story({
	name: '카카오 로그인 완료 토스트',
	parameters: {
		caseConditions: ['카카오톡으로 로그인한 뒤 홈에 처음 들어오면 잠깐 표시되는 안내예요.'],
	},
	play: async ({ canvasElement }) => {
		const body = within(canvasElement.ownerDocument.body);
		await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
		showKakaoLoginToast();
		await expect(await body.findByText('카카오톡으로 로그인했어요')).toBeVisible();
	},
});

ProfileEmpty.test('필수 정보를 입력하면 저장 버튼이 활성화돼요', fillProfileForm);
ProfileEmpty.test(
	'저장 중에는 다시 저장할 수 없어요',
	{ render: renderProfile('pending') },
	showProfileSaving,
);
ProfileEmpty.test('저장하면 프로필 설정 완료 안내가 표시돼요', saveProfile);
ProfileEmpty.test(
	'저장에 실패하면 다시 시도할 수 있어요',
	{ render: renderProfile('failure') },
	showProfileSaveError,
);

FirstGuide.test('출석 안내부터 마지막 단계까지 진행할 수 있어요', completeGuide(6));
GuideWithoutAttendance.test('세션 안내부터 마지막 단계까지 진행할 수 있어요', completeGuide(5));
