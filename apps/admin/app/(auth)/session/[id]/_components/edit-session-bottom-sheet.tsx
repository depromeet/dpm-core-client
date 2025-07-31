'use client';

import { SESSION_ATTENDANCE_TIME_CODE_LENGTH } from '@dpm-core/api';
import {
	ATTENDANCE_GAP_DURATION,
	ATTENDANCE_LATE_DURATION,
	calcSessionAttendanceTimeByHHmmToISOString,
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	Form,
	FormField,
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
	useAppShell,
	validateHHMM,
} from '@dpm-core/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { type PropsWithChildren, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { CtaButton } from '@/components/cta-button';

import { editSessionAttendanceTimeMutationOptions } from '@/remotes/mutations/session';
import { formatAttendanceStartTimeToCode } from '../../_helpers';

interface EditSessionBottomSheetProps {
	attendanceStartTime: string;
	sessionId: string;
	onSuccess?: () => void;
}

const editSessionAttendanceTimeSchema = z.object({
	sessionId: z.string(),
	attendanceStartTime: z
		.string()
		.length(SESSION_ATTENDANCE_TIME_CODE_LENGTH)
		.regex(/^\d{4}$/, '숫자 4자리만 입력 가능합니다'),
});

type EditSessionAttendanceTimeSchema = z.infer<typeof editSessionAttendanceTimeSchema>;

const EditSessionBottomSheet = ({
	children,
	attendanceStartTime,
	sessionId,
	onSuccess,
}: PropsWithChildren<EditSessionBottomSheetProps>) => {
	const form = useForm<EditSessionAttendanceTimeSchema>({
		resolver: zodResolver(editSessionAttendanceTimeSchema),
		defaultValues: {
			sessionId,
			attendanceStartTime: formatAttendanceStartTimeToCode(attendanceStartTime),
		},
	});

	const [isOpen, setIsOpen] = useState(false);
	const { ref } = useAppShell();

	const { mutate: editSessionAttendanceTime, isPending } = useMutation(
		editSessionAttendanceTimeMutationOptions(),
	);

	const handleSuccess = () => {
		onSuccess?.();
		setIsOpen(false);
	};

	const onSubmit = (data: EditSessionAttendanceTimeSchema) => {
		const { sessionId, attendanceStartTime: inputAttendanceStartTime } = data;
		const updatedAttendanceStartTime = calcSessionAttendanceTimeByHHmmToISOString(
			attendanceStartTime,
			inputAttendanceStartTime,
		);

		editSessionAttendanceTime(
			{ sessionId, attendanceStartTime: updatedAttendanceStartTime },
			{
				onSuccess: handleSuccess,
			},
		);
	};

	const attendanceStartTimeWatch = form.watch('attendanceStartTime');

	const isDisabled =
		!form.formState.isDirty ||
		isPending ||
		form.formState.isSubmitting ||
		!validateHHMM(attendanceStartTimeWatch);

	return (
		<Drawer
			activeSnapPoint={1}
			open={isOpen}
			onOpenChange={isPending ? () => {} : setIsOpen}
			container={ref.current}
		>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent
				className="mx-auto"
				style={{
					// FIXME: 바텀시트 위치 계산식 분리
					maxWidth: ref.current?.clientWidth ?? 'auto',
				}}
			>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} id="edit-session-attendance-time-form">
						<DrawerTitle className="sr-only">출석/지각 시간 수정</DrawerTitle>
						<DrawerDescription className="sr-only">
							정해진 규정에 따라 출석/지각 시간이 자동 계산됩니다.
							<br />- 출석 가능: 세션 시작부터 5분간
							<br />- 지각 가능: 출석 가능 시간 이후 30분간
						</DrawerDescription>
						<DrawerHeader className="!text-left !gap-y-2 items-start px-5 pt-[30px]">
							<h3 className="text-title2 font-semibold text-label-normal">출석/지각 시간 수정</h3>
						</DrawerHeader>
						<div className="px-5 mt-8">
							<label
								htmlFor="start-time-input"
								className="flex justify-between items-center cursor-pointer"
							>
								<p className="text-body2 text-label-assistive font-semibold">출석 시작 시간</p>
								<FormField
									control={form.control}
									name="attendanceStartTime"
									render={({ field }) => (
										<div className="flex items-center gap-x-2 w-full max-w-[215px] py-[14px] h-fit bg-background-strong rounded-lg justify-center focus-within:ring focus-within:ring-gray-900 focus-within:ring-offset-1 transition-[box-shadow]">
											<InputOTP
												id="start-time-input"
												maxLength={4}
												placeholder="0000"
												pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
												value={field.value}
												onChange={field.onChange}
											>
												<InputOTPGroup>
													<InputOTPSlot
														className="size-2.5 text-body2 font-medium text-label-normal !ring-0"
														index={0}
													/>
													<InputOTPSlot
														className="size-2.5 text-body2 font-medium text-label-normal !ring-0"
														index={1}
													/>
													<p className="text-label-assistive text-body2 font-medium mx-1">시</p>
													<InputOTPSlot
														className="size-2.5 text-body2 font-medium text-label-normal !ring-0"
														index={2}
													/>
													<InputOTPSlot
														className="size-2.5 text-body2 font-medium text-label-normal !ring-0"
														index={3}
													/>
													<p className="text-label-assistive text-body2 font-medium ml-1">
														분 부터
													</p>
												</InputOTPGroup>
											</InputOTP>
										</div>
									)}
								/>
							</label>
						</div>
						<div className="px-5">
							<div className="my-3 bg-line-normal h-px" />
						</div>
						<p className="text-label-subtle text-caption1 font-medium px-5 mb-5">
							정해진 규정에 따라 출석/지각 시간이 자동 계산됩니다.
							<br />- 출석 가능: 출석 시작 시간으로부터 {ATTENDANCE_GAP_DURATION / (1000 * 60)}분간
							<br />- 지각 가능: 출석 종료 시간으로부터 {ATTENDANCE_LATE_DURATION / (1000 * 60)}분간
						</p>
					</form>
				</Form>
				<CtaButton
					disabled={isDisabled}
					text="저장하기"
					type="submit"
					form="edit-session-attendance-time-form"
				/>
			</DrawerContent>
		</Drawer>
	);
};

export { EditSessionBottomSheet };
