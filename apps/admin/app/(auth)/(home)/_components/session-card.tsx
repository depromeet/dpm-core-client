import Link from 'next/link';
import { cn } from '@dpm-core/shared';

interface SessionCardProps {
	subtitle: string;
	title: string;
	startTimeInfo: string;
	place: string;
	sessionId?: string;
	className?: string;
}

const SessionCard = ({
	subtitle,
	title,
	startTimeInfo,
	place,
	sessionId,
	className,
}: SessionCardProps) => {
	// 고유한 view-transition-name을 위한 스타일
	const cardStyle = sessionId
		? {
				viewTransitionName: `session-card-${sessionId}`,
			}
		: {};

	return (
		<Link
			href={`/session/${sessionId}`}
			className={cn(
				'flex animate-view-transition cursor-pointer flex-col rounded-lg bg-background-subtle p-5 transition-colors hover:bg-background-strong',
				className,
			)}
			style={cardStyle}
		>
			<small
				className="text-caption1 text-label-subtle"
				style={sessionId ? { viewTransitionName: `session-subtitle-${sessionId}` } : {}}
			>
				{subtitle}
			</small>
			<h3
				className="font-semibold text-body1"
				style={sessionId ? { viewTransitionName: `session-title-${sessionId}` } : {}}
			>
				{title}
			</h3>
			<div className="my-4 h-px w-full bg-line-normal" />
			<div className="flex flex-col gap-y-3">
				<div className="flex gap-x-4">
					<span className="w-[70px] font-semibold text-body2 text-label-assistive">세션 시간</span>
					<span className="inline-flex font-medium text-body2 text-label-subtle">
						{startTimeInfo}
					</span>
				</div>
				<div className="flex gap-x-4">
					<span className="w-[70px] font-semibold text-body2 text-label-assistive">세션 장소</span>
					<span className="inline-flex font-medium text-body2 text-label-subtle">{place}</span>
				</div>
			</div>
		</Link>
	);
};

export { SessionCard };
