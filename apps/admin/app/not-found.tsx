import Link from 'next/link';
import { Button, ErrorState } from '@dpm-core/shared';

export default function NotFound() {
	return (
		<ErrorState
			variant="notFound"
			action={
				<Button
					className="fixed bottom-0 md:relative md:mt-13.5 md:w-45 md:rounded-lg"
					variant="secondary"
					size="full"
					asChild
				>
					<Link href="/">홈으로 돌아가기</Link>
				</Button>
			}
		/>
	);
}
