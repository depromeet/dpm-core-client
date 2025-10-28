import { AppLayout, Button } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';

import { CreateSessionContainer } from './_components/create-session-container';

export default function CreateSessionPage() {
	return (
		<AppLayout className="bg-background-normal">
			<AppHeader
				title="세션 추가"
				rightIcon={
					<Button variant="secondary" size="md" disabled>
						저장
					</Button>
				}
			/>
			<CreateSessionContainer />
		</AppLayout>
	);
}
