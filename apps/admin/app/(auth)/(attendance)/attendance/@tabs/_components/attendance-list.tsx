import { AttendanceItem } from './attendance-item';

export const AttendanceList = () => {
	return (
		<section>
			{Array.from({ length: 30 }, (_, index) => {
				return <AttendanceItem key={index} />;
			})}
		</section>
	);
};
