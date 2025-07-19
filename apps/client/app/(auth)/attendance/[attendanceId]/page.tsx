import { Button, InputOTP, InputOTPGroup, InputOTPSlot } from '@dpm-core/shared';
import { AppLayout } from '@/layout/app-layout';

const AttendancePage = async ({ params }: { params: Promise<{ attendanceId: string }> }) => {
	const { attendanceId } = await params;

	return (
		<AppLayout className="flex flex-col flex-1 items-center justify-center h-dvh relative">
			<span className="text-title1 text-[#1A1C1E] font-bold mb-4">출석코드를 입력해 주세요</span>
			<InputOTP maxLength={4}>
				<InputOTPGroup className="flex gap-x-2 w-fit">
					<InputOTPSlot
						className="w-[54px] h-[64px] border-none bg-background-strong rounded-sm text-title1 font-bold text-label-normal"
						index={0}
					/>
					<InputOTPSlot
						className="w-[54px] h-[64px] border-none bg-background-strong rounded-sm text-title1 font-bold text-label-normal"
						index={1}
					/>
					<InputOTPSlot
						className="w-[54px] h-[64px] border-none bg-background-strong rounded-sm text-title1 font-bold text-label-normal"
						index={2}
					/>
					<InputOTPSlot
						className="w-[54px] h-[64px] border-none bg-background-strong rounded-sm text-title1 font-bold text-label-normal"
						index={3}
					/>
				</InputOTPGroup>
			</InputOTP>

			<div className="mt-8">
				<p className="text-body2 font-medium text-label-assistive">출석 시간 : 14:00 ~ 14:05</p>
				<p className="text-body2 font-medium text-label-assistive">지각 시간 : 14:06 ~ 14:36</p>
			</div>

			<Button
				className="absolute bottom-0 rounded-none bg-background-inverse w-full"
				size="full"
				disabled
			>
				완료하기
			</Button>
		</AppLayout>
	);
};

export default AttendancePage;
