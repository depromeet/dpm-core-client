'use client';

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
	pressInOutVariatns,
} from '@dpm-core/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { MotionButton } from '@/components/motion';
import { useCheckAttendance } from '@/remotes/mutations/attendance';

const FormSchema = z.object({
	attendanceCode: z.string().min(4, {
		message: '출석코드 4자리를 모두 입력해주세요',
	}),
});

interface AttendanceFormProps {
	sessionId: number;
}

export const AttendanceForm = (props: AttendanceFormProps) => {
	const { sessionId } = props;
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			attendanceCode: '',
		},
	});

	const { mutate: checkAttendance, isPending } = useCheckAttendance({
		onError: () => {},
		onSuccess: () => {},
	});

	const handleSubmitCode = (data: z.infer<typeof FormSchema>) => {
		checkAttendance({ sessionId, attedanceCode: data.attendanceCode });
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmitCode)}
				className="flex justify-center items-center flex-col mt-12 gap-4"
			>
				<FormField
					control={form.control}
					name="attendanceCode"
					render={({ field }) => (
						<FormItem className="flex flex-col items-center gap-0">
							<FormLabel htmlFor="code" className="text-title1 font-bold text-[#1A1C1E] mb-4">
								출석코드를 입력해 주세요
							</FormLabel>
							<FormControl>
								<InputOTP maxLength={4} id="code" {...field}>
									<InputOTPGroup>
										<InputOTPSlot index={0} className="min-h-16 min-w-[54px]" />
										<InputOTPSlot index={1} />
										<InputOTPSlot index={2} />
										<InputOTPSlot index={3} />
									</InputOTPGroup>
								</InputOTP>
							</FormControl>
							<FormDescription className="mt-8 text-body2 font-medium text-label-assistive">
								<span>출석 시간 : 14:00 ~ 14:05</span>
								<br />
								<span>지각 시간 : 14:06 ~ 14:36</span>
							</FormDescription>
						</FormItem>
					)}
				/>
				<MotionButton
					variant="secondary"
					size="full"
					className="fixed max-w-lg w-full bottom-0"
					{...pressInOutVariatns}
					disabled={!form.formState.isValid || isPending}
				>
					{isPending && <Loader2Icon className="animate-spin" />}
					완료하기
				</MotionButton>
			</form>
		</Form>
	);
};
