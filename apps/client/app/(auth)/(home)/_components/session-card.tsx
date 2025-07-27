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
			className="bg-background-subtle flex flex-col rounded-lg p-5 animate-view-transition"
			style={cardStyle}
		>
			<small
				className="text-label-subtle text-caption1"
				style={id ? { viewTransitionName: `session-subtitle-${id}` } : {}}
			>
				{subtitle}
			</small>
			<h3
				className="text-body1 font-semibold"
				style={id ? { viewTransitionName: `session-title-${id}` } : {}}
			>
				{title}
			</h3>
			<div className="my-4 bg-line-normal w-full h-px" />
			<div className="gap-y-3 flex flex-col">
				<div className="gap-x-4 flex">
					<span className="text-body2 font-semibold text-label-assistive w-[70px]">세션 시간</span>
					<span className="inline-flex text-body2 text-label-subtle font-medium">
						{startTimeInfo}
					</span>
				</div>
				<div className="gap-x-4 flex">
					<span className="text-body2 font-semibold text-label-assistive w-[70px]">세션 장소</span>
					<span className="inline-flex text-body2 text-label-subtle font-medium">{place}</span>
				</div>
			</div>
		</div>
	);
};

export { SessionCard };
