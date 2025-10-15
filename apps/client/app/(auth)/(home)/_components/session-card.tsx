'use client';

interface SessionCardProps {
	subtitle: string;
	title: string;
	startTimeInfo: string;
	place: string;
	id?: string; // 고유 ID 추가
}

const SessionCard = ({ subtitle, title, startTimeInfo, place, id }: SessionCardProps) => {
	// 고유한 view-transition-name을 위한 스타일
	const cardStyle = id
		? {
				viewTransitionName: `session-card-${id}`,
			}
		: {};

	return (
		<div
			className="flex animate-view-transition flex-col rounded-lg bg-background-subtle p-5"
			style={cardStyle}
		>
			<small
				className="text-caption1 text-label-subtle"
				style={id ? { viewTransitionName: `session-subtitle-${id}` } : {}}
			>
				{subtitle}
			</small>
			<h3
				className="font-semibold text-body1"
				style={id ? { viewTransitionName: `session-title-${id}` } : {}}
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
		</div>
	);
};

export { SessionCard };
