import { AppHeader } from '@/components/app-header';
import { SubmittedMemberList } from './_components/submitted-member-list';

interface Props {
	params: Promise<{ billId: string }>;
}

export default async function BillMemberSubmitPage({ params }: Props) {
	const { billId } = await params;

	return (
		<>
			<AppHeader title="제출 현황" className="mb-1.5" />
			<section className="mx-4">
				<div className="px-4 py-3 bg-background-strong rounded-lg text-label-subtle text-caption1 font-medium">
					초대 멤버 전원이 참석 여부를 제출하면 멤버를 확정할 수 있어요.
				</div>
			</section>

			<SubmittedMemberList billId={Number(billId)} />
		</>
	);
}
