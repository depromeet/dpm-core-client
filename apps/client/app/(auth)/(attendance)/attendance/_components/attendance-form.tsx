'use client';

import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorBoundary } from '@suspensive/react';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
	calcSessionAttendanceTime,
	calcSessionLateAttendanceTime,
	cn,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	gaTrackAttendanceEnter,
	gaTrackAttendanceSubmit,
	gaTrackSessionStart,
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
	toast,
	usePreventScroll,
} from '@dpm-core/shared';

import { CtaButton } from '@/components/cta-button';
import { LoadingBox } from '@/components/loading-box';
import { formatISOStringHHMM } from '@/lib/date';
import { checkAttendanceOptions } from '@/remotes/mutations/attendance';
import {
	getAttendanceMeBySessionIdOptions,
	getAttendanceMeOptions,
} from '@/remotes/queries/attendance';
import { getSessionAttendanceTimeOptions } from '@/remotes/queries/session';

interface AttendanceFormProps {
	sessionId: number;
}

function addOneMinute(date: string) {
	return dayjs(date).add(1, 'minute').toISOString();
}

const AttendanceFormContainer = ({ sessionId }: AttendanceFormProps) => {
	const {
		data: { data: attendance },
	} = useSuspenseQuery(getSessionAttendanceTimeOptions(sessionId));

	return (
		<AttendanceFormControl
			sessionId={sessionId}
			attendanceStartTime={attendance.attendanceStartTime}
		/>
	);
};

const FormSchema = z.object({
	attendanceCode: z.string().min(4, {
		message: '출석코드 4자리를 모두 입력해주세요',
	}),
});

const AttendanceFormControl = (props: AttendanceFormProps & { attendanceStartTime: string }) => {
	const { sessionId, attendanceStartTime } = props;
	const [keyboardOpen, setKeyboardOpen] = useState(false);

	const router = useRouter();
	const queryClient = useQueryClient();

	useEffect(() => {
		gaTrackAttendanceEnter(sessionId.toString());
		gaTrackSessionStart(sessionId.toString());
	}, [sessionId]);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			attendanceCode: '',
		},
	});
	usePreventScroll({ isDisabled: !keyboardOpen });

	const { mutate: checkAttendance, isPending: isPendingCheckAttendance } = useMutation(
		checkAttendanceOptions(sessionId, {
			onSuccess: () => {
				gaTrackAttendanceSubmit(sessionId.toString(), 'success');

				queryClient.invalidateQueries(getAttendanceMeBySessionIdOptions({ sessionId }));
				queryClient.invalidateQueries(getAttendanceMeOptions());
				router.replace(`/attendance/${sessionId}/result`);
			},
			onError: async (error) => {
				gaTrackAttendanceSubmit(sessionId.toString(), 'fail');

				const serverError = await error.response.json();
				if (serverError.code === 'SESSION-400-04') {
					toast.error('이미 출석을 체크했습니다.');
				} else if (serverError.code === 'SESSION-400-02') {
					toast.error('코드가 일치하지 않습니다.');
				} else {
					toast.error('운영진에게 문의해 주세요.');
				}
			},
		}),
	);

	const handleSubmitCode = (data: z.infer<typeof FormSchema>) => {
		checkAttendance(data);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmitCode)}
				id="attendance-form"
				className={cn(
					'flex flex-1 flex-col items-center justify-center gap-4',
					keyboardOpen && 'pb-56',
				)}
			>
				<FormField
					control={form.control}
					name="attendanceCode"
					render={({ field }) => {
						return (
							<FormItem className="flex flex-col items-center gap-0">
								<FormLabel htmlFor="code" className="mb-4 font-bold text-[#1A1C1E] text-title1">
									출석코드를 입력해 주세요
								</FormLabel>
								<FormControl>
									<InputOTP maxLength={4} id="code" {...field}>
										<InputOTPGroup>
											<InputOTPSlot index={0} />
											<InputOTPSlot index={1} />
											<InputOTPSlot index={2} />
											<InputOTPSlot index={3} />
										</InputOTPGroup>
									</InputOTP>
								</FormControl>
								<FormDescription className="mt-8 font-medium text-body2 text-label-assistive">
									<span>
										출석 시간 : {formatISOStringHHMM(attendanceStartTime)} -{' '}
										{formatISOStringHHMM(
											calcSessionAttendanceTime(attendanceStartTime).toISOString(),
										)}
									</span>
									<br />
									<span>
										지각 시간 :{' '}
										{formatISOStringHHMM(
											calcSessionAttendanceTime(addOneMinute(attendanceStartTime)).toISOString(),
										)}{' '}
										-{' '}
										{formatISOStringHHMM(
											calcSessionLateAttendanceTime(attendanceStartTime).toISOString(),
										)}
									</span>
								</FormDescription>
							</FormItem>
						);
					}}
				/>
			</form>
			<CtaButton
				className="fixed bottom-0 mx-auto w-full rounded-none"
				disabled={!form.formState.isValid || form.formState.isSubmitting}
				isLoading={isPendingCheckAttendance}
				text="완료하기"
				type="submit"
				form="attendance-form"
				onKeyboardStateChange={setKeyboardOpen}
			/>
		</Form>
	);
};

export const AttendanceForm = (props: AttendanceFormProps) => {
	const { sessionId } = props;
	return (
		<ErrorBoundary fallback={() => <section>존재하지 않는 출석 세션입니다.</section>}>
			<Suspense fallback={<LoadingBox />}>
				<AttendanceFormContainer sessionId={sessionId} />
			</Suspense>
		</ErrorBoundary>
	);
};
