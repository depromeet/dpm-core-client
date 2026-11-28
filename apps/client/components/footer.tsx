'use client';

import Image from 'next/image';
import { TextLogo } from '@dpm-core/shared';

import CopyRight from '@/assets/images/copyright.png';
import { useExternalLinkClick } from '@/hooks/use-external-link-click';

const Footer = () => {
	const handleExternalLinkClick = useExternalLinkClick();

	return (
		<footer className="flex min-h-55 flex-col bg-background-inverse px-4 py-6.5">
			<TextLogo className="text-gray-0" />
			<div className="my-4.5 flex items-center gap-x-2">
				<a
					href="https://depromeet.notion.site/24645b4338b380a59fd3d82fad44c5fd"
					onClick={handleExternalLinkClick}
					target="_blank"
					className="text-caption1 font-semibold text-gray-400 underline"
					rel="noopener"
				>
					개인정보 처리방침
				</a>
				<a
					href="https://depromeet.notion.site/24645b4338b38010b874e707c7d94e3e"
					onClick={handleExternalLinkClick}
					target="_blank"
					className="text-caption1 font-semibold text-gray-400 underline"
					rel="noopener"
				>
					서비스 이용약관
				</a>
			</div>
			<div className="mt-auto">
				<div className="flex flex-wrap items-center">
					<a
						href="https://www.instagram.com/depromeet/"
						onClick={handleExternalLinkClick}
						target="_blank"
						className="text-caption1 font-medium text-label-assistive"
						rel="noopener"
					>
						Instagram
					</a>
					<div className="mx-2 h-2.5 w-px bg-gray-400" />
					<a
						href="https://www.behance.net/Depromeet"
						onClick={handleExternalLinkClick}
						target="_blank"
						className="text-caption1 font-medium text-label-assistive"
						rel="noopener"
					>
						Behance
					</a>
					<div className="mx-2 h-2.5 w-px bg-gray-400" />
					<a
						href="https://github.com/depromeet/"
						onClick={handleExternalLinkClick}
						target="_blank"
						className="text-caption1 font-medium text-label-assistive"
						rel="noopener"
					>
						Github
					</a>
					<div className="mx-2 h-2.5 w-px bg-gray-400" />
					<a
						href="https://depromeet.medium.com/"
						onClick={handleExternalLinkClick}
						target="_blank"
						className="text-caption1 font-medium text-label-assistive"
						rel="noopener"
					>
						Medium
					</a>
					<div className="mx-2 h-2.5 w-px bg-gray-400" />
					<a
						href="https://www.linkedin.com/company/depromeet/"
						onClick={handleExternalLinkClick}
						target="_blank"
						className="text-caption1 font-medium text-label-assistive"
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
