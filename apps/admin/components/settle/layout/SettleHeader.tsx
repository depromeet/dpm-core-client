'use client';

import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import SettleHeaderFilter from './SettleHeaderFilter';

interface HeaderConfig {
	title: string;

	withFilter: boolean;
}

const settleHeaderMap: Record<string, HeaderConfig> = {
	'/settle': {
		title: '정산',
		withFilter: true,
	},
	'/settle/create': {
		title: '정산서 만들기',
		withFilter: false,
	},
	'/settle/create/done': {
		title: '최종 정산서',
		withFilter: false,
	},
};

const SettleHeader = () => {
	const pathname = usePathname();
	const router = useRouter();

	const config = settleHeaderMap[pathname] ?? {
		title: '정산',
		withToggle: true,
	};

	return (
		<header className="max-w-lg mx-auto fixed top-0 left-0 right-0 z-10 px-4 bg-white h-12">
			{/* header content */}
			<div className="h-12 flex items-center justify-center relative">
				<button
					type="button"
					onClick={() => router.back()}
					className="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 duration-200 text-gray-400 hover:text-gray-600"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
					>
						<title>Back arrow icon</title>
						<path
							d="M15.563 2.96284C15.9145 2.61134 16.4842 2.61134 16.8357 2.96284C17.1871 3.31434 17.1871 3.88409 16.8357 4.23559L9.072 11.9998L16.8357 19.764L16.8978 19.832C17.1862 20.1855 17.1652 20.7072 16.8357 21.0367C16.5061 21.3663 15.9845 21.3873 15.631 21.0989L15.563 21.0367L7.16302 12.6362C6.81155 12.2847 6.81155 11.7149 7.16302 11.3634L15.563 2.96284Z"
							fill="currentColor"
						/>
					</svg>
				</button>
				<h1 className="text-body1 font-semibold text-gray-900">{config.title}</h1>
			</div>

			{/* toggle group */}
			{config.withFilter && <SettleHeaderFilter />}
		</header>
	);
};

export default SettleHeader;
