import Image from 'next/image';
import { TextLogo } from '@dpm-core/shared';

import CopyRight from '@/assets/images/copyright.png';

const Footer = () => {
	return (
		<footer className="flex min-h-[223px] flex-col bg-background-inverse px-4 py-[26px]">
			<TextLogo className="text-gray-0" />
			<div className="my-[18px] flex items-center gap-x-2">
				<a
					href="https://depromeet.notion.site/24645b4338b380a59fd3d82fad44c5fd"
					target="_blank"
					className="font-semibold text-caption1 text-gray-400 underline"
					rel="noopener"
				>
					개인정보 처리방침
				</a>
				<a
					href="https://depromeet.notion.site/24645b4338b38010b874e707c7d94e3e"
					target="_blank"
					className="font-semibold text-caption1 text-gray-400 underline"
					rel="noopener"
				>
					서비스 이용약관
				</a>
			</div>
			<div className="mt-auto">
				<div className="flex flex-wrap items-center">
					<a
						href="https://www.instagram.com/depromeet/"
						target="_blank"
						className="font-medium text-caption1 text-label-assistive"
						rel="noopener"
					>
						Instagram
					</a>
					<div className="mx-2 h-[10px] w-px bg-gray-400" />
					<a
						href="https://www.behance.net/Depromeet"
						target="_blank"
						className="font-medium text-caption1 text-label-assistive"
						rel="noopener"
					>
						Behance
					</a>
					<div className="mx-2 h-[10px] w-px bg-gray-400" />
					<a
						href="https://github.com/depromeet/"
						target="_blank"
						className="font-medium text-caption1 text-label-assistive"
						rel="noopener"
					>
						Github
					</a>
					<div className="mx-2 h-[10px] w-px bg-gray-400" />
					<a
						href="https://depromeet.medium.com/"
						target="_blank"
						className="font-medium text-caption1 text-label-assistive"
						rel="noopener"
					>
						Medium
					</a>
					<div className="mx-2 h-[10px] w-px bg-gray-400" />
					<a
						href="https://www.linkedin.com/company/depromeet/"
						target="_blank"
						className="font-medium text-caption1 text-label-assistive"
						rel="noopener"
					>
						LinkedIn
					</a>
				</div>
				<Image src={CopyRight} width={167} height={6} alt="copyright" className="mt-1.5" />
			</div>
		</footer>
	);
};

export { Footer };
