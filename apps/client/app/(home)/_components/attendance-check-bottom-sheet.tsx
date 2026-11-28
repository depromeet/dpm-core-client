'use client';

import { type PropsWithChildren, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { ApiErrorReponse, AttendanceStatus } from '@dpm-core/api';
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
import { CLARITY_ACTION_ID, type ClarityActionId } from '@/constants/clarity';
import { useAppConfig } from '@/providers/app-config-provider';
import { useClarity } from '@/providers/client-clarity-adapter';
import { checkAttendanceOptions } from '@/remotes/mutations/attendance';
import {
	getAttendanceMeBySessionIdOptions,
	getAttendanceMeOptions,
} from '@/remotes/queries/attendance';
import { getMyPendingSessionFeedbackQuery } from '@/remotes/queries/session-feedback';

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

const { HOME } = CLARITY_ACTION_ID;

const attendanceCodeSuccessActions = new Map<AttendanceStatus, ClarityActionId>([
	['PRESENT', HOME.ATTENDANCE_CODE_SUCCEEDED_PRESENT],
	['LATE', HOME.ATTENDANCE_CODE_SUCCEEDED_LATE],
	['ABSENT', HOME.ATTENDANCE_CODE_SUCCEEDED_ABSENT],
]);

const attendanceCodeFailureActions = new Map<string, ClarityActionId>([
	['SESSION-400-02', HOME.ATTENDANCE_CODE_FAILED_MISMATCH],
	['SESSION-400-03', HOME.ATTENDANCE_CODE_FAILED_TOO_EARLY],
	['SESSION-400-04', HOME.ATTENDANCE_CODE_FAILED_ALREADY_RECORDED],
	['SESSION-400-06', HOME.ATTENDANCE_CODE_FAILED_EXPIRED],
	['SESSION-400-07', HOME.ATTENDANCE_CODE_FAILED_FINALIZED],
	['ATTENDANCE-403-01', HOME.ATTENDANCE_CODE_FAILED_FORBIDDEN],
]);

export const AttendanceCheckBottomSheet = ({
	children,
	sessionId,
}: PropsWithChildren<AttendanceCheckBottomSheetProps>) => {
	const { isApp } = useAppConfig();
	const { track } = useClarity();
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

	const trackAttendanceCode = (actionId: ClarityActionId) => {
		try {
			track(actionId);
		} catch {
			// 분석 이벤트 실패가 출석 인증에 영향을 주지 않도록 한다.
		}
	};

	const { mutate: checkAttendance, isPending: isCheckAttendancePending } = useMutation({
		...checkAttendanceOptions(sessionId),
		onSuccess: async (response) => {
			gaTrackAttendanceSubmit(sessionId.toString(), 'success');

			const { attendanceStatus } = response.data;
			trackAttendanceCode(
				attendanceCodeSuccessActions.get(attendanceStatus) ?? HOME.ATTENDANCE_CODE_SUCCEEDED,
			);

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
				queryClient.invalidateQueries(getMyPendingSessionFeedbackQuery()),
			]);

			handleClose();
		},
		onError: async (error) => {
			gaTrackAttendanceSubmit(sessionId.toString(), 'fail');

			const isHttpError = error instanceof HTTPError;
			const serverError = isHttpError
				? ((await error.response.json().catch(() => null)) as Partial<ApiErrorReponse> | null)
				: null;
			const failureAction = (() => {
				if (!isHttpError) return HOME.ATTENDANCE_CODE_FAILED_NETWORK;

				return (
					attendanceCodeFailureActions.get(serverError?.code ?? '') ??
					HOME.ATTENDANCE_CODE_FAILED_OTHER
				);
			})();
			trackAttendanceCode(failureAction);

			if (!isHttpError) {
				toast.error('네트워크 상태를 확인해 주세요.');

				return;
			}

			if (serverError?.code === 'SESSION-400-02') {
				setIsValidationError(true);

				return;
			}
			const message = typeof serverError?.message === 'string' ? serverError.message.trim() : '';
			toast.error(message || '운영진에게 문의해 주세요.');
		},
	});

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
		trackAttendanceCode(HOME.ATTENDANCE_CODE_SUBMITTED);
		checkAttendance(data);
	};

	const handleOpenChange = (open: boolean) => {
		if (open) {
			trackAttendanceCode(HOME.ATTENDANCE_CODE_VIEWED);
		} else {
			handleReset();
		}
		setIsOpen(open);
	};

	return (
		<Drawer open={isOpen} onOpenChange={handleOpenChange} repositionInputs={!isApp}>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent className="pb-safe-area mx-auto max-w-lg">
				<Form {...form}>
					<DrawerTitle className="sr-only">출석코드를 입력해 주세요</DrawerTitle>
					<DrawerHeader
						showCloseButton={false}
						className="mb-4 flex flex-col items-start gap-1 px-5 text-title1 font-bold text-label-normal"
					>
						출석코드를 입력해 주세요
						{isValidationError ? (
							<p className="flex items-center gap-2 text-body2 font-semibold text-red-400">
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
