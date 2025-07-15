'use client';

import { cn } from '@dpm-core/shared';
import { OTPInput, OTPInputContext } from 'input-otp';
import { MinusIcon } from 'lucide-react';
import * as React from 'react';

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
			className={cn('disabled:cursor-not-allowed', className)}
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
				'rounded-sm bg-background-strong relative flex h-16 w-14 items-center justify-center text-title1 font-bold transition-all outline-none data-[active=true]:ring-gray-900 data-[active=true]:z-10 data-[active=true]:ring',
				className,
			)}
			{...props}
		>
			{char}
			{hasFakeCaret && (
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
					<div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
				</div>
			)}
		</div>
	);
}

function InputOTPSeparator({ ...props }: React.ComponentProps<'div'>) {
	return (
		// biome-ignore lint/a11y/useFocusableInteractive: <explanation>
		// biome-ignore lint/a11y/useSemanticElements: <explanation>
		<div data-slot="input-otp-separator" role="separator" {...props}>
			<MinusIcon />
		</div>
	);
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
