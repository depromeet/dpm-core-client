import { AppLayout, Button } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';
import { Section } from '@/components/section';

import { CreateSessionContainer } from './_components/CreateSessionContainer';
import { FORM_ID } from './_components/SessionForm';

export default function CreateSessionPage() {
	return (
		<AppLayout className="bg-background-normal">
			<AppHeader
				title="세션 추가"
				rightIcon={
					<Button variant="secondary" size="md" type="submit" form={FORM_ID}>
						저장하기
					</Button>
				}
			/>
			<Section className="mx-auto w-full max-w-[800px] py-8">
				<CreateSessionContainer />
			</Section>
		</AppLayout>
	);
}
