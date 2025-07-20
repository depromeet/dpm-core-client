'use client';

import { useRouter } from 'next/navigation';

const CreateSettleBtn = () => {
	const router = useRouter();
	const handleCreateSettle = () => {
		router.push('/settle/create');
	};
	return (
		<button
			onClick={handleCreateSettle}
			type="button"
			className="bg-gray-800 z-10 cursor-pointer fixed right-5 bottom-5 flex items-center justify-center w-20 h-12 gap-1 py-2 px-4 rounded-full shadow-sm
	transition-transform duration-200 ease-in-out hover:-translate-y-1 active:scale-95"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="13"
				height="13"
				viewBox="0 0 13 13"
				fill="none"
			>
				<title>Create Settle Button Icon</title>
				<path
					d="M0.416992 6.99805C0.416992 6.58383 0.752779 6.24805 1.16699 6.24805H12.8337C13.2479 6.24805 13.5837 6.58383 13.5837 6.99805C13.5837 7.41226 13.2479 7.74805 12.8337 7.74805H1.16699C0.752779 7.74805 0.416992 7.41226 0.416992 6.99805Z"
					fill="#fff"
				/>
				<path
					d="M7 0.415039C7.41421 0.415039 7.75 0.750825 7.75 1.16504V12.8317C7.75 13.2459 7.41421 13.5817 7 13.5817C6.58579 13.5817 6.25 13.2459 6.25 12.8317V1.16504C6.25 0.750825 6.58579 0.415039 7 0.415039Z"
					fill="#fff"
				/>
			</svg>
			<span className="text-body2 text-white font-semibold">추가</span>
		</button>
	);
};

export default CreateSettleBtn;
