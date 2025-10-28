import Link from 'next/link';

export const VocBanner = () => {
	return (
		<Link
			href="https://forms.gle/yV88T98WsADu6VNc6"
			target="_blank"
			className="flex items-center justify-between rounded-lg bg-primary-extralight p-5 max-lg:px-2.5 max-lg:py-3"
		>
			<div>
				<p className="flex items-center font-bold text-primary-normal text-title2 max-lg:flex-col">
					<span>VOC</span>
					<span className="max-lg:text-caption1">수집중!</span>
				</p>
				<p className="mt-2 font-medium text-caption1 text-label-assistive max-lg:hidden">
					여러분의 의견을 기다리고 있어요!
				</p>
			</div>
		</Link>
	);
};
