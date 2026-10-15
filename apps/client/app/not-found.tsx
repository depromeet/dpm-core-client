import Link from 'next/link';
import { Button, ErrorState } from '@dpm-core/shared';

export default function NotFound() {
	return (
		<ErrorState
			variant="notFound"
			action={
				<Button className="fixed bottom-0 max-w-lg" variant="secondary" size="full" asChild>
					<Link href="/">홈으로 돌아가기</Link>
				</Button>
			}
		/>
	);
}
