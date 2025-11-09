import { formatISOStringToFullDateString } from '@/lib/date';

interface SessionInfoSectionProps {
	week: number;
	eventName: string;
	date: string;
}

export const SessionInfoSection = ({ week, eventName, date }: SessionInfoSectionProps) => {
	return (
		<section>
			<h3 className="mb-3 font-semibold text-body1 text-label-normal">세션 정보</h3>
			<div className="flex flex-col gap-3 rounded-lg bg-background-subtle px-5 py-4">
				<div className="flex items-center gap-4">
					<p className="w-20 font-medium text-body2 text-label-assistive">세션 주차</p>
					<p className="font-medium text-body2 text-label-normal">{week}주차</p>
				</div>
				<div className="flex items-center gap-4">
					<p className="w-20 font-medium text-body2 text-label-assistive">세션명</p>
					<p className="font-medium text-body2 text-label-normal">{eventName}</p>
				</div>
				<div className="flex items-center gap-4">
					<p className="w-20 font-medium text-body2 text-label-assistive">세션 날짜</p>
					<p className="font-medium text-body2 text-label-normal">
						{formatISOStringToFullDateString(date)}
					</p>
				</div>
			</div>
		</section>
	);
};
