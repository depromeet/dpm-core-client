import DetailTemplate from '@/components/settle/templates/DetailTemplate';

interface Props {
	params: { settleId: string };
}

export default async function SettleDetailPage({ params }: Props) {
	const { settleId } = await params;

	return (
		<div className="relative pt-12 pb-14">
			<DetailTemplate settleId={settleId} />
		</div>
	);
}
