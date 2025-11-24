import { Suspense } from 'react';
import { AppLayout, Button } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';
import { LoadingBox } from '@/components/loading-box';
import { Section } from '@/components/section';

import { FORM_ID } from '../../create/_components/SessionForm';
import { SessionModifyContainer } from './_components/SessionModifyContainer';

export default async function SessionModifyPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	return (
		<AppLayout className="bg-background-normal">
			<AppHeader
				title="세션 수정"
				rightIcon={
					<Button variant="secondary" size="md" type="submit" form={FORM_ID}>
						수정하기
					</Button>
				}
			/>
			<Suspense fallback={<LoadingBox />}>
				<Section className="mx-auto w-full max-w-[800px] py-8">
					<SessionModifyContainer sessionId={Number(id)} />
				</Section>
			</Suspense>
		</AppLayout>
	);
}
