'use client';

import { useRouter } from 'next/navigation';

const AttendHeader = () => {
	const router = useRouter();
	return (
		<header className="max-w-lg mx-auto fixed top-0 left-0 right-0 z-10 px-4 bg-white h-12">
			<div className="h-12 flex items-center justify-center relative">
				<button
					type="button"
					onClick={() => router.push('/')}
					className="cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 duration-200 text-gray-400 hover:text-gray-600"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="15"
						height="15"
						viewBox="0 0 15 15"
						fill="none"
					>
						<title>icon</title>
						<path
							fill="currentColor"
							fillRule="evenodd"
							clipRule="evenodd"
							d="M14.3362 1.06392C14.6877 1.41541 14.6877 1.9853 14.3362 2.3368L2.3362 14.3376C1.98473 14.6891 1.41488 14.6891 1.06341 14.3376C0.711937 13.9861 0.711937 13.4162 1.06341 13.0647L13.0634 1.06392C13.4149 0.712419 13.9847 0.712419 14.3362 1.06392Z"
						/>
						<path
							fill="currentColor"
							fillRule="evenodd"
							clipRule="evenodd"
							d="M1.06341 1.06392C1.41488 0.712419 1.98473 0.712419 2.3362 1.06392L14.3362 13.0647C14.6877 13.4162 14.6877 13.9861 14.3362 14.3376C13.9847 14.6891 13.4149 14.6891 13.0634 14.3376L1.06341 2.3368C0.711937 1.9853 0.711937 1.41541 1.06341 1.06392Z"
						/>
					</svg>
				</button>
				<h1 className="text-body1 font-semibold text-gray-900">회식 참석 조사</h1>
			</div>
		</header>
	);
};

export default AttendHeader;
