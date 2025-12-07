'use client';

import { useRouter } from 'next/navigation';
import { Button, XCircle } from '@dpm-core/shared';

export const SessionCloseModalButton = () => {
	const router = useRouter();

	const redirectToSession = () => {
		router.back();
	};

	return (
		<Button variant="none" size="none" onClick={() => redirectToSession()}>
			<XCircle />
		</Button>
	);
};
