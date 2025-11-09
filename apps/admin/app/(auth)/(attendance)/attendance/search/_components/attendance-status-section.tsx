import * as RadioGroup from '@radix-ui/react-radio-group';
import type { AttendanceStatus } from '@dpm-core/api';
import { ATTENDANCE_STATUS_OPTIONS, Button } from '@dpm-core/shared';

import AttendanceStatusLabel from '@/components/attendance/AttendanceStatusLabel';
import { formatISOStringToFullDateString } from '@/lib/date';

interface AttendanceStatusSectionProps {
	isEditMode: boolean;
	selectedStatus: AttendanceStatus;
	originalStatus: AttendanceStatus;
	attendedAt: string;
	onStatusChange: (status: AttendanceStatus) => void;
	onSave: () => void;
	onCancel: () => void;
	onEdit: () => void;
	isSaveDisabled: boolean;
}

export const AttendanceStatusSection = ({
	isEditMode,
	selectedStatus,
	originalStatus,
	attendedAt,
	onStatusChange,
	onSave,
	onCancel,
	onEdit,
	isSaveDisabled,
}: AttendanceStatusSectionProps) => {
	return (
		<section className="mb-6">
			<h3 className="mb-3 font-semibold text-body1 text-label-normal">출석 정보</h3>
			{isEditMode ? (
				<>
					<RadioGroup.Root
						value={selectedStatus}
						className="flex w-full rounded-lg border border-line-normal"
						onValueChange={(value) => onStatusChange(value as AttendanceStatus)}
					>
						{ATTENDANCE_STATUS_OPTIONS.map((status) => (
							<RadioGroup.Item
								key={status.value}
								value={status.value}
								className="flex-1 px-3 py-2.5 text-label-assistive data-[state=checked]:bg-primary-extralight data-[state=checked]:text-primary-normal"
							>
								<span className="whitespace-nowrap font-normal text-body2">{status.label}</span>
							</RadioGroup.Item>
						))}
					</RadioGroup.Root>
					<div className="mt-3 flex gap-2">
						<Button
							variant="none"
							size="none"
							onClick={onSave}
							disabled={isSaveDisabled}
							className="rounded-lg bg-gray-800 px-4 py-3 font-medium text-body2 text-white disabled:opacity-50"
						>
							저장하기
						</Button>
						<Button
							variant="none"
							size="none"
							onClick={onCancel}
							className="rounded-lg bg-gray-100 px-4 py-3 font-medium text-body2"
						>
							취소
						</Button>
					</div>
				</>
			) : (
				<>
					<div className="flex flex-col gap-3 rounded-lg bg-background-subtle px-5 py-4">
						<div className="flex items-center gap-4">
							<p className="w-20 font-medium text-body2 text-label-assistive">출석 상태</p>
							<AttendanceStatusLabel status={originalStatus} />
						</div>
						<div className="flex items-center gap-4">
							<p className="w-20 font-medium text-body2 text-label-assistive">출석 시간</p>
							<p className="font-medium text-body2 text-label-normal">
								{formatISOStringToFullDateString(attendedAt)}
							</p>
						</div>
					</div>
					<Button
						variant="none"
						size="none"
						onClick={onEdit}
						className="mt-3 rounded-lg border border-line-normal bg-white px-4 py-3 font-medium text-body2"
					>
						수정
					</Button>
				</>
			)}
		</section>
	);
};
