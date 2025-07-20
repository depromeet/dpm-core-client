import { Avatar, AvatarImage } from '@dpm-core/shared';
import { CircleMinus } from 'lucide-react';

export const AttendanceItem = () => {
	return (
		<div className="flex py-3">
			<div className="flex gap-4 items-center flex-1">
				<Avatar>
					<AvatarImage src="https://github.com/shadcn.png" />
				</Avatar>
				<div className="flex flex-col items-start gap-[2px]">
					<span className="text-body1 font-semibold">김서현</span>
					<div className="flex gap-3.5 text-label-assistive text-caption1">
						<span>1조</span>
						<span>디자이너</span>
					</div>
				</div>
			</div>
			<div className="flex items-center text-body2 text-label-assistive">
				<CircleMinus fill="#3EA32C" size={20} color="#fff" />
				<span>인정</span>
			</div>
		</div>
	);
};
