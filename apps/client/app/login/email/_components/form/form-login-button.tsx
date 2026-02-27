'use client';

import { createPortal } from 'react-dom';
import { Button, type ButtonProps, useAppShell } from '@dpm-core/shared';

export const FormLoginButton = (props: ButtonProps) => {
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
			로그인
		</Button>,
		ref.current,
	);
};
