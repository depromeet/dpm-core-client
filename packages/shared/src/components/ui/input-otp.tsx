'use client';

import { OTPInput, OTPInputContext } from 'input-otp';
import { MinusIcon } from 'lucide-react';
import * as React from 'react';
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
			className={cn('disabled:cursor-not-allowed !opacity-0', className)}
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
				'rounded-sm bg-background-strong relative flex h-16 w-14 text-label-normal items-center justify-center text-title1 font-bold transition-all outline-none data-[active=true]:z-10',
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
					<div className="animate-caret-blink h-[1em] w-px duration-1000 bg-background-inverse" />
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
