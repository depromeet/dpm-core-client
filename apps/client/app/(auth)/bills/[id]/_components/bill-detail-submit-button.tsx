'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { createPortal } from 'react-dom';
import { Button, cn, useAppShell, useKeyboardTop } from '@dpm-core/shared';

interface BillDetailSubmitButtonProps extends ComponentPropsWithoutRef<typeof Button> {
	formId?: string;
}

const BillDetailSubmitButton = ({ formId, ...props }: BillDetailSubmitButtonProps) => {
	const { ref } = useAppShell();

	const buttonRef = useKeyboardTop<HTMLButtonElement>();

	return createPortal(
		<Button
			{...props}
			ref={buttonRef}
			className={cn('fixed bottom-0 mx-auto w-full', props.className)}
			variant="secondary"
			size="full"
			style={{
				maxWidth: ref.current.clientWidth,
			}}
			form={formId}
		>
			참석여부 제출하기
		</Button>,
		ref.current,
	);
};

export { BillDetailSubmitButton };
