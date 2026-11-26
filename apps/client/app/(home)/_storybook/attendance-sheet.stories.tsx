import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
	type AttendanceSubmissionCase,
	makeAttendanceSubmission,
} from './attendance-sheet.fixtures';
import { attendanceSheetPlay } from './attendance-sheet.play';
import { HOME_CLOCK, makeAttendance } from './home-cases';
import { HomePreview } from './home-preview';

interface AttendanceSheetPreviewProps {
	result: AttendanceSubmissionCase;
	now: string;
}

const AttendanceSheetPreview = ({ result, now }: AttendanceSheetPreviewProps) => (
	<HomePreview
		scenario={{
			now,
			attendanceSheet: makeAttendanceSubmission(result, now),
			...(result === 'ABSENT' && {
				attendance: makeAttendance('ABSENT', { canRegisterLateParticipation: true }),
				feedback: null,
			}),
		}}
	/>
);

const meta = {
	title: 'Cases/홈/출석 코드 시트',
	component: AttendanceSheetPreview,
	args: { result: 'PRESENT', now: HOME_CLOCK.attendanceOpen },
	render: (args, { id }) => <AttendanceSheetPreview key={id} {...args} />,
} satisfies Meta<typeof AttendanceSheetPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
	name: '빈 입력',
	play: attendanceSheetPlay.Empty,
};

export const Partial: Story = {
	name: '코드 3자리 입력',
	tags: ['!dev'],
	play: attendanceSheetPlay.Partial,
};

export const Ready: Story = {
	name: '코드 4자리 입력',
	tags: ['!dev'],
	play: attendanceSheetPlay.Ready,
};

export const Pending: Story = {
	name: '인증 제출 중',
	args: { result: 'pending' },
	tags: ['!dev'],
	play: attendanceSheetPlay.Pending,
};

export const Present: Story = {
	name: '정상 인증 완료',
	tags: ['!dev'],
	play: attendanceSheetPlay.Present,
};

export const Late: Story = {
	name: '지각 인증 완료',
	args: { result: 'LATE', now: HOME_CLOCK.lateOpen },
	tags: ['!dev'],
	play: attendanceSheetPlay.Late,
};

export const LateParticipation: Story = {
	name: '늦은 참여 등록 완료',
	args: { result: 'ABSENT', now: HOME_CLOCK.lateParticipation },
	tags: ['!dev'],
	play: attendanceSheetPlay.LateParticipation,
};

export const WrongCode: Story = {
	name: '코드 불일치',
	tags: ['!dev'],
	play: attendanceSheetPlay.WrongCode,
};

export const TooEarly: Story = {
	name: '인증 시작 전 응답',
	args: { result: 'tooEarly' },
	tags: ['!dev'],
	play: attendanceSheetPlay.TooEarly,
};

export const AlreadyRegistered: Story = {
	name: '이미 인증한 응답',
	args: { result: 'alreadyRegistered' },
	tags: ['!dev'],
	play: attendanceSheetPlay.AlreadyRegistered,
};

export const Closed: Story = {
	name: '인증 마감 응답',
	args: { result: 'closed' },
	tags: ['!dev'],
	play: attendanceSheetPlay.Closed,
};

export const ManuallyUpdated: Story = {
	name: '운영진 상태 확정 응답',
	args: { result: 'manuallyUpdated' },
	tags: ['!dev'],
	play: attendanceSheetPlay.ManuallyUpdated,
};

export const Organizer: Story = {
	name: '운영진 인증 불가 응답',
	args: { result: 'organizer' },
	tags: ['!dev'],
	play: attendanceSheetPlay.Organizer,
};

export const ServerError: Story = {
	name: '서버 응답 오류',
	args: { result: 'server' },
	tags: ['!dev'],
	play: attendanceSheetPlay.ServerError,
};

export const NetworkError: Story = {
	name: '네트워크 오류',
	args: { result: 'network' },
	tags: ['!dev'],
	play: attendanceSheetPlay.NetworkError,
};
