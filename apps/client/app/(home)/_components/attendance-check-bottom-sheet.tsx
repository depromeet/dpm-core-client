'use client';

import { type PropsWithChildren, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { useForm } from 'react-hook-form';
import z from 'zod';
import {
	CircleAlert,
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	Form,
	FormControl,
	FormField,
	gaTrackAttendanceSubmit,
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
	toast,
} from '@dpm-core/shared';

import { Pressable } from '@/components/motion';
import { checkAttendanceOptions } from '@/remotes/mutations/attendance';
import {
	getAttendanceMeBySessionIdOptions,
	getAttendanceMeOptions,
} from '@/remotes/queries/attendance';

interface AttendanceCheckBottomSheetProps {
	sessionId: number;
}

const FORM_ID = 'attendance-form';

const FormSchema = z.object({
	attendanceCode: z.string().min(4, {
		message: '출석코드 4자리를 모두 입력해주세요',
	}),
});

type FormSchemaType = z.infer<typeof FormSchema>;

export const AttendanceCheckBottomSheet = ({
	children,
	sessionId,
}: PropsWithChildren<AttendanceCheckBottomSheetProps>) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isValidationError, setIsValidationError] = useState(false);

	const form = useForm<FormSchemaType>({
		mode: 'onChange',
		resolver: zodResolver(FormSchema),
		defaultValues: {
			attendanceCode: '',
		},
	});

	const queryClient = useQueryClient();

	const { mutate: checkAttendance, isPending: isCheckAttendancePending } = useMutation(
		checkAttendanceOptions(sessionId, {
			onSuccess: async (response) => {
				gaTrackAttendanceSubmit(sessionId.toString(), 'success');

				const { attendanceStatus } = response.data;

				if (attendanceStatus === 'PRESENT') {
					toast.success('출석했어요.');
				} else if (attendanceStatus === 'LATE') {
					toast.success('출석했어요. 오늘은 조금 늦었네요.');
				} else if (attendanceStatus === 'ABSENT') {
					toast.error('결석 처리 됐어요.');
				}

				await Promise.all([
					queryClient.invalidateQueries(getAttendanceMeBySessionIdOptions({ sessionId })),
					queryClient.invalidateQueries(getAttendanceMeOptions()),
				]);

				handleClose();
			},
			onError: async (error) => {
				  gaTrackAttendanceSubmit(sessionId.toString(), 'fail');

				  if (error instanceof HTTPError) {
				    const serverError = await error.response.json<ServerError>();
				
				    if (serverError.code === 'SESSION-400-04') {
				      toast.error('이미 출석을 체크했습니다.');
				    } else if (serverError.code === 'SESSION-400-02') {
				      setIsValidationError(true);
				    } else {
				      toast.error('운영진에게 문의해 주세요.');
				    }
				
				    return;
				  }
				
				  toast.error('네트워크 상태를 확인해 주세요.');
			},
		}),
	);

	const isSubmitDisabled = !form.formState.isValid || isCheckAttendancePending;

	const inputOtpClassName = isValidationError ? 'border border-red-500' : undefined;

	const handleReset = () => {
		form.reset();
		setIsValidationError(false);
	};

	const handleClose = () => {
		handleReset();
		setIsOpen(false);
	};

	const handleSubmitCode = (data: FormSchemaType) => {
		checkAttendance(data);
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			handleReset();
		}
		setIsOpen(open);
	};

	return (
		<Drawer open={isOpen} onOpenChange={handleOpenChange}>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent className="mx-auto max-w-lg pb-safe-area">
				<Form {...form}>
					<DrawerTitle className="sr-only">출석코드를 입력해 주세요</DrawerTitle>
					<DrawerHeader
						showCloseButton={false}
						className="mb-4 flex flex-col items-start gap-1 px-5 font-bold text-label-normal text-title1"
					>
						출석코드를 입력해 주세요
						{isValidationError ? (
							<p className="flex items-center gap-2 font-semibold text-body2 text-red-400">
								<CircleAlert />
								코드가 일치하지 않아요.
							</p>
						) : null}
					</DrawerHeader>

					<form
						onSubmit={form.handleSubmit(handleSubmitCode)}
						id={FORM_ID}
						className="mx-auto mb-1"
					>
						<FormField
							control={form.control}
							name="attendanceCode"
							render={({ field }) => {
								return (
									<FormControl>
										<InputOTP
											{...field}
											maxLength={4}
											onChange={(value) => {
												field.onChange(value);
												setIsValidationError(false);
											}}
										>
											<InputOTPGroup>
												<InputOTPSlot className={inputOtpClassName} index={0} />
												<InputOTPSlot className={inputOtpClassName} index={1} />
												<InputOTPSlot className={inputOtpClassName} index={2} />
												<InputOTPSlot className={inputOtpClassName} index={3} />
											</InputOTPGroup>
										</InputOTP>
									</FormControl>
								);
							}}
						/>
					</form>

					<DrawerFooter className="px-5">
						<Pressable
							type="submit"
							form={FORM_ID}
							disabled={isSubmitDisabled}
							variant="secondary"
							size="lg"
						>
							입력 완료
						</Pressable>
						<Pressable
							disabled={isCheckAttendancePending}
							variant="none"
							size="lg"
							onClick={handleClose}
						>
							닫기
						</Pressable>
					</DrawerFooter>
				</Form>
			</DrawerContent>
		</Drawer>
	);
};
