'use client';

import * as React from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { MinusIcon } from 'lucide-react';

import { cn } from '../../utils/cn';

function InputOTP({
	className,
	containerClassName,
	...props
}: React.ComponentProps<typeof OTPInput> & {
	containerClassName?: string;
}) {
	return (
		<OTPInput
			data-slot="input-otp"
			containerClassName={cn('flex items-center gap-2 has-disabled:opacity-40', containerClassName)}
			className={cn('!opacity-0 disabled:cursor-not-allowed', className)}
			{...props}
		/>
	);
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="input-otp-group"
			className={cn('flex items-center gap-2', className)}
			{...props}
		/>
	);
}

function InputOTPSlot({
	index,
	className,
	...props
}: React.ComponentProps<'div'> & {
	index: number;
}) {
	const inputOTPContext = React.useContext(OTPInputContext);
	const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

	return (
		<div
			data-slot="input-otp-slot"
			data-active={isActive}
			className={cn(
				'relative flex h-16 w-14 items-center justify-center rounded-sm bg-background-strong font-bold text-label-normal text-title1 outline-none transition-all data-[active=true]:z-10',
				className,
			)}
			{...props}
		>
			{char}
			{(isActive || hasFakeCaret) && (
				<div
					className={cn(
						'pointer-events-none absolute inset-0 flex items-center justify-center',
						isActive && !hasFakeCaret && '-mr-[0.6em]',
					)}
				>
					<div className="h-[1em] w-px animate-caret-blink bg-background-inverse duration-1000" />
				</div>
			)}
		</div>
	);
}

function InputOTPSeparator({ ...props }: React.ComponentProps<'div'>) {
	return (
		<div data-slot="input-otp-separator" {...props}>
			<MinusIcon />
		</div>
	);
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
