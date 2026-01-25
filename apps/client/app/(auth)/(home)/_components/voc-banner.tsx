import Link from 'next/link';
import { ChevronRight } from '@dpm-core/shared';

export const VocBanner = () => {
	return (
		<div className="px-4">
			<Link
				href="https://forms.gle/yV88T98WsADu6VNc6"
				target="_blank"
				className="flex items-center justify-between rounded-lg bg-primary-extralight p-5"
			>
				<div>
					<h3 className="font-bold text-primary-normal text-title2">디프만 코어 VOC 수집중!</h3>
					<p className="mt-2 text-body2 text-label-assistive">
						디프만 코어, 어떻게 느끼고 계신가요?
						<br />
						여러분의 의견을 기다리고 있어요!
					</p>
				</div>
				<ChevronRight className="text-icon-noraml" />
			</Link>
		</div>
	);
};
