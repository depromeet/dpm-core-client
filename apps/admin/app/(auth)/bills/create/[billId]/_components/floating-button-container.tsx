import { Button } from '@dpm-core/shared';
import Link from 'next/link';

interface FloatingButtonContainer {
	billId: number;
}

export const FloatingButtonContainer = (props: FloatingButtonContainer) => {
	const { billId } = props;

	return (
		<Button size="full" variant="secondary" asChild>
			<Link href={`/bills/${billId}`}>정산서 상세보기</Link>
		</Button>
	);
};
