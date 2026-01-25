'use client';

import { createPortal } from 'react-dom';
import { Button, type ButtonProps, useAppShell } from '@dpm-core/shared';

export const SignupButton = (props: ButtonProps) => {
	const { ref } = useAppShell();

	if (!ref.current) return null;

	return createPortal(
		<Button
			className="fixed bottom-0 mx-auto max-w-lg"
			type="submit"
			size="full"
			variant="secondary"
			{...props}
		>
			다음
		</Button>,
		ref.current,
	);
};
