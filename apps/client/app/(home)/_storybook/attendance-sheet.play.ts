import { expect, type UserEventObject, waitFor, within } from 'storybook/test';

import { ATTENDANCE_CODE, ATTENDANCE_SUBMISSION_ERRORS } from './attendance-sheet.fixtures';

interface PlayContext {
	canvasElement: HTMLElement;
	userEvent: UserEventObject;
}

type Play = (context: PlayContext) => Promise<void>;

const sheetTitle = '출석코드를 입력해 주세요';

async function openSheet({ canvasElement, userEvent }: PlayContext) {
	const canvas = within(canvasElement);
	await userEvent.click(await canvas.findByRole('button', { name: /출석체크하기/ }));

	const viewport = within(canvasElement.ownerDocument.body);
	const dialog = within(await viewport.findByRole('dialog', { name: sheetTitle }));

	return {
		viewport,
		dialog,
		input: dialog.getByRole('textbox'),
		submit: dialog.getByRole('button', { name: '입력 완료' }),
		close: dialog.getByRole('button', { name: '닫기' }),
	};
}

async function fillCode(context: PlayContext, code = ATTENDANCE_CODE) {
	const sheet = await openSheet(context);
	await context.userEvent.type(sheet.input, code);
	await expect(sheet.input).toHaveValue(code);
	return sheet;
}

async function submitCode(context: PlayContext, code = ATTENDANCE_CODE) {
	const sheet = await fillCode(context, code);
	await waitFor(() => expect(sheet.submit).toBeEnabled());
	await context.userEvent.click(sheet.submit);
	return sheet;
}

function playSuccess(message: string, completedLabel: string, hidesFeedback = false): Play {
	return async (context) => {
		const { viewport } = await submitCode(context);
		await expect(await viewport.findByText(message)).toBeVisible();
		await waitFor(() =>
			expect(viewport.queryByRole('dialog', { name: sheetTitle })).not.toBeInTheDocument(),
		);
		const completedButton = await viewport.findByRole('button', {
			name: (name) => name.includes(completedLabel),
		});
		await expect(completedButton).toBeDisabled();

		if (hidesFeedback) {
			await expect(viewport.queryByRole('link', { name: /피드백 남기기/ })).not.toBeInTheDocument();
		}
	};
}

function playErrorToast(message: string): Play {
	return async (context) => {
		const { viewport, submit, input } = await submitCode(context);
		await expect(await viewport.findByText(message)).toBeVisible();
		await expect(input).toHaveValue(ATTENDANCE_CODE);
		await waitFor(() => expect(submit).toBeEnabled());
	};
}

export const attendanceSheetPlay = {
	Empty: async (context) => {
		const { input, submit } = await openSheet(context);
		await expect(input).toHaveValue('');
		await expect(submit).toBeDisabled();
	},
	Partial: async (context) => {
		const { submit } = await fillCode(context, ATTENDANCE_CODE.slice(0, 3));
		await expect(submit).toBeDisabled();
	},
	Ready: async (context) => {
		const { submit } = await fillCode(context);
		await waitFor(() => expect(submit).toBeEnabled());
	},
	Pending: async (context) => {
		const { close, submit } = await submitCode(context);
		await waitFor(() => expect(submit).toBeDisabled());
		await expect(close).toBeDisabled();
	},
	Present: playSuccess('출석했어요.', '출석을 완료했어요'),
	Late: playSuccess('출석했어요. 오늘은 조금 늦었네요.', '출석을 완료했어요'),
	LateParticipation: playSuccess('결석 처리 됐어요.', '출석을 마감했어요', true),
	WrongCode: async (context) => {
		const { dialog, submit } = await submitCode(context, '0000');
		await expect(await dialog.findByText('코드가 일치하지 않아요.')).toBeVisible();
		await waitFor(() => expect(submit).toBeEnabled());
	},
	TooEarly: playErrorToast(ATTENDANCE_SUBMISSION_ERRORS.tooEarly.message),
	AlreadyRegistered: playErrorToast(ATTENDANCE_SUBMISSION_ERRORS.alreadyRegistered.message),
	Closed: playErrorToast(ATTENDANCE_SUBMISSION_ERRORS.closed.message),
	ManuallyUpdated: playErrorToast(ATTENDANCE_SUBMISSION_ERRORS.manuallyUpdated.message),
	Organizer: playErrorToast(ATTENDANCE_SUBMISSION_ERRORS.organizer.message),
	ServerError: playErrorToast('운영진에게 문의해 주세요.'),
	NetworkError: playErrorToast('네트워크 상태를 확인해 주세요.'),
} satisfies Record<string, Play>;
