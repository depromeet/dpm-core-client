'use client';

import { Button, ErrorState } from '@dpm-core/shared';

export default function Error({ reset }: { reset: () => void }) {
	return (
		<ErrorState
			variant="network"
			action={
				<Button className="fixed bottom-0 max-w-lg" variant="secondary" size="full" onClick={reset}>
					다시 시도하기
				</Button>
			}
		/>
	);
}
