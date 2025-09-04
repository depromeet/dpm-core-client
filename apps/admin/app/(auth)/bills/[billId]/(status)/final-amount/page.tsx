import { AppHeader } from '@/components/app-header';
import { FinalAmountByMemberList } from './_components/final-amount-by-member-list';

interface Props {
	params: Promise<{ billId: string }>;
}

export default async function BillFinalAmountByMemberPage({ params }: Props) {
	const { billId } = await params;

	return (
		<>
			<AppHeader title="멤버별 최종 금액" className="mb-1.5" />
			<section className="mx-4">
				<div className="px-4 py-3 bg-background-strong rounded-lg text-label-subtle text-caption1 font-medium">
					멤버별 정산 예정 금액입니다. 실제 입금 여부는 모임통장에서 확인해 주세요.
				</div>
			</section>
			<FinalAmountByMemberList billId={Number(billId)} />
		</>
	);
}
