import Link from 'next/link';

export const AfterPartyAddButton = () => {
	return (
		<Link
			href="/after-party/create"
			className="absolute right-[20px] bottom-[32px] flex h-[48px] items-center justify-center space-x-[6px] rounded-[38px] bg-gray-800 px-[10px]"
		>
			<AddIcon />
			<span className="font-semibold text-body1 text-gray-0">추가</span>
		</Link>
	);
};

const AddIcon = () => {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<title>plus</title>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3.41699 10.0039C3.41699 9.58969 3.75278 9.25391 4.16699 9.25391H15.8337C16.2479 9.25391 16.5837 9.58969 16.5837 10.0039C16.5837 10.4181 16.2479 10.7539 15.8337 10.7539H4.16699C3.75278 10.7539 3.41699 10.4181 3.41699 10.0039Z"
				fill="#9CA3AF"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M10 3.4209C10.4142 3.4209 10.75 3.75668 10.75 4.1709V15.8376C10.75 16.2518 10.4142 16.5876 10 16.5876C9.58579 16.5876 9.25 16.2518 9.25 15.8376V4.1709C9.25 3.75668 9.58579 3.4209 10 3.4209Z"
				fill="#9CA3AF"
			/>
		</svg>
	);
};
