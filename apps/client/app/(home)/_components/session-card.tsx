'use client';

interface SessionCardProps {
	title: string;
	subtitle: string;
	startTimeInfo: string;
	place: string;
}

export const SessionCard = (props: SessionCardProps) => {
	const { title, subtitle, startTimeInfo, place } = props;
	return (
		<div className="flex flex-col rounded-lg bg-background-normal p-5">
			<small className="text-caption1 text-label-subtle">{subtitle}</small>
			<h3 className="font-semibold text-body1">{title}</h3>
			<div className="my-4 h-px w-full bg-line-normal" />
			<div className="flex flex-col gap-y-3">
				<div className="flex gap-x-4">
					<span className="w-17.5 font-semibold text-body2 text-label-assistive">세션 시간</span>
					<span className="inline-flex font-medium text-body2 text-label-subtle">
						{startTimeInfo}
					</span>
				</div>
				<div className="flex gap-x-4">
					<span className="w-17.5 font-semibold text-body2 text-label-assistive">세션 장소</span>
					<span className="inline-flex font-medium text-body2 text-label-subtle">{place}</span>
				</div>
			</div>
		</div>
	);
};
