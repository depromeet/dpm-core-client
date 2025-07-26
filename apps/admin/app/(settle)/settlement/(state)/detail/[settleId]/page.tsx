import DetailTemplate from '@/components/settlement/templates/DetailTemplate';

interface Props {
	params: Promise<{ settleId: string }>;
}

export default async function SettlementDetailPage({ params }: Props) {
	const { settleId } = await params;

	return (
		<div className="relative pt-12">
			<DetailTemplate settleId={settleId} />
		</div>
	);
}
