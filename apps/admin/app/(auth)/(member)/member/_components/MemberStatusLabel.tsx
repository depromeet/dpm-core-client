'use client';

import type React from 'react';

import type { MemberStatus } from '@dpm-core/api';
import { cn } from '@dpm-core/shared';

const IconPending = () => (
	<svg
		width={16}
		height={16}
		viewBox="0 0 16 16"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden
	>
		<title>승인 필요</title>
		<path
			d="M8 1.60596C11.5346 1.60596 14.4004 4.47173 14.4004 8.00635C14.4001 11.5407 11.5345 14.4058 8 14.4058C4.46554 14.4058 1.59987 11.5407 1.59961 8.00635C1.59961 4.47173 4.46538 1.60596 8 1.60596ZM8 7.09131C7.49505 7.09131 7.08594 7.5014 7.08594 8.00635C7.0862 8.51107 7.49522 8.92041 8 8.92041C8.50478 8.92041 8.9138 8.51107 8.91406 8.00635C8.91406 7.5014 8.50495 7.09131 8 7.09131Z"
			fill="#9CA3AF"
		/>
	</svg>
);

const IconActive = () => (
	<svg
		width={16}
		height={16}
		viewBox="0 0 16 16"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden
	>
		<title>활동 중</title>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M7.99961 1.60474C4.46499 1.60474 1.59961 4.47011 1.59961 8.00474C1.59961 11.5394 4.46499 14.4047 7.99961 14.4047C11.5342 14.4047 14.3996 11.5394 14.3996 8.00474C14.3996 4.47011 11.5342 1.60474 7.99961 1.60474ZM5.39961 8.00474C5.39961 7.67337 5.66824 7.40474 5.99961 7.40474H9.99961C10.331 7.40474 10.5996 7.67337 10.5996 8.00474C10.5996 8.33611 10.331 8.60474 9.99961 8.60474H5.99961C5.66824 8.60474 5.39961 8.33611 5.39961 8.00474Z"
			fill="#67BB4E"
		/>
	</svg>
);

const IconInactive = () => (
	<svg
		width={16}
		height={16}
		viewBox="0 0 16 16"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden
	>
		<title>활동 중단</title>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M7.99961 1.60107C4.46499 1.60107 1.59961 4.46645 1.59961 8.00107C1.59961 11.5357 4.46499 14.4011 7.99961 14.4011C11.5342 14.4011 14.3996 11.5357 14.3996 8.00107C14.3996 4.46645 11.5342 1.60107 7.99961 1.60107ZM7.02387 6.17681C6.78956 5.9425 6.40966 5.9425 6.17535 6.17681C5.94103 6.41112 5.94103 6.79102 6.17535 7.02534L7.15108 8.00107L6.17535 8.97681C5.94103 9.21112 5.94103 9.59102 6.17535 9.82534C6.40966 10.0597 6.78956 10.0597 7.02387 9.82534L7.99961 8.8496L8.97535 9.82534C9.20966 10.0597 9.58956 10.0597 9.82387 9.82534C10.0582 9.59102 10.0582 9.21112 9.82387 8.97681L8.84814 8.00107L9.82387 7.02534C10.0582 6.79102 10.0582 6.41112 9.82387 6.17681C9.58956 5.9425 9.20966 5.9425 8.97535 6.17681L7.99961 7.15255L7.02387 6.17681Z"
			fill="#FF7070"
		/>
	</svg>
);

const MEMBER_STATUS_CONFIG: Record<
	MemberStatus,
	{ label: string; icon: React.ReactNode; textClassName: string }
> = {
	PENDING: {
		label: '승인 필요',
		icon: <IconPending />,
		textClassName: 'text-label-assistive',
	},
	ACTIVE: {
		label: '활동 중',
		icon: <IconActive />,
		textClassName: 'text-status-positive',
	},
	INACTIVE: {
		label: '활동 중단',
		icon: <IconInactive />,
		textClassName: 'text-status-negative',
	},
	WITHDRAWN: {
		label: '탈퇴',
		icon: <IconPending />,
		textClassName: 'text-label-assistive',
	},
};

interface MemberStatusLabelProps extends React.ComponentProps<'span'> {
	status: MemberStatus;
}

export const MemberStatusLabel = ({ status, className, ...props }: MemberStatusLabelProps) => {
	const config = MEMBER_STATUS_CONFIG[status];

	return (
		<span className={cn('flex items-center gap-1.5', className)} {...props}>
			<span className="shrink-0">{config.icon}</span>
			<span className={cn('font-medium text-body2', config.textClassName)}>{config.label}</span>
		</span>
	);
};
