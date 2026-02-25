import { AfterPartyDetail } from './_components/after-party-detail';

const AfterPartyDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	return <AfterPartyDetail gatheringId={Number(id)} />;
};

export default AfterPartyDetailPage;
