import AttendTemplate from '@/components/settlement/templates/AttendTemplate';

interface Props {
	params: Promise<{ settleId: string }>;
}

export default async function SettlementAttendPage({ params }: Props) {
	const { settleId } = await params;

	return (
		<div className="relative pt-12 pb-14">
			<AttendTemplate settleId={settleId} />
		</div>
	);
}
