'use client';

import './globals.css';

import { Button, ErrorState } from '@dpm-core/shared';

export default function GlobalError({ reset }: { reset: () => void }) {
	return (
		<html lang="ko">
			<body>
				<ErrorState
					variant="network"
					action={
						<Button
							className="fixed bottom-0 md:relative md:mt-13.5 md:w-45 md:rounded-lg"
							variant="secondary"
							size="full"
							onClick={reset}
						>
							다시 시도하기
						</Button>
					}
				/>
			</body>
		</html>
	);
}
