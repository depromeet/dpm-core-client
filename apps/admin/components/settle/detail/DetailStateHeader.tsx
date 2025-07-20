'use client';

import { usePathname, useRouter } from 'next/navigation';

const DetailStateHeader = () => {
	const router = useRouter();
	const pathname = usePathname();

	const headerTitle = pathname?.includes('/submit') ? '제출 현황' : '참석 현황';
	return (
		<header className="max-w-lg mx-auto fixed top-0 left-0 right-0 z-10 px-4 bg-white h-12">
			<div className="h-12 flex items-center justify-center relative">
				<h2 className="text-gray-900 text-body1 font-semibold">
					#일이삼사오육칠팔구십 {headerTitle}
				</h2>
				<button
					type="button"
					onClick={() => router.back()}
					className="cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 duration-200 text-gray-400 hover:text-gray-600"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="15"
						height="15"
						viewBox="0 0 15 15"
						fill="none"
						className="text-gray-400 hover:text-gray-600"
					>
						<title>icon</title>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M14.3362 1.0644C14.6877 1.4159 14.6877 1.98579 14.3362 2.33728L2.3362 14.3381C1.98473 14.6896 1.41488 14.6896 1.06341 14.3381C0.711937 13.9866 0.711937 13.4167 1.06341 13.0652L13.0634 1.0644C13.4149 0.712907 13.9847 0.712907 14.3362 1.0644Z"
							fill="currentColor"
						/>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M1.06341 1.0644C1.41488 0.712907 1.98473 0.712907 2.3362 1.0644L14.3362 13.0652C14.6877 13.4167 14.6877 13.9866 14.3362 14.3381C13.9847 14.6896 13.4149 14.6896 13.0634 14.3381L1.06341 2.33728C0.711937 1.98579 0.711937 1.4159 1.06341 1.0644Z"
							fill="currentColor"
						/>
					</svg>
				</button>
			</div>
		</header>
	);
};

export default DetailStateHeader;
