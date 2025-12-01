'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@dpm-core/shared';

import { useSession } from '@/app/(auth)/(home)/_components/session-provider';
import { formatISOStringToFullDateString } from '@/lib/date';

export const FormWeek = () => {
	const form = useFormContext();

	const { sessions } = useSession();

	const lastSession = sessions.at(-1);

	return (
		<FormField
			control={form.control}
			name="week"
			render={({ field }) => (
				<FormItem>
					<FormLabel>세션 주차</FormLabel>
					<FormControl>
						<Input
							placeholder="ex. 1"
							className="border border-line-normal bg-inherit"
							{...field}
						/>
					</FormControl>

					<FormMessage className="text-red-400" />

					{lastSession && (
						<p className="font-medium text-body2">
							<span className="mr-1.5 text-label-assistive">최근 추가된 세션 정보</span>
							<span className="text-label-subtle">
								{`${lastSession.week}주차 ${lastSession.name} ${formatISOStringToFullDateString(lastSession.date)}`}
							</span>
						</p>
					)}
				</FormItem>
			)}
		/>
	);
};
