const Footer = () => {
	return (
		<footer className="bg-background-inverse py-[26px] px-4 flex-1 flex flex-col">
			<h3 className="text-white">DPM CORE (LOGO)</h3>
			<div className="flex items-center gap-x-2 mt-[18px]">
				<a
					href="https://depromeet.com/privacy"
					target="_blank"
					className="underline text-gray-400 text-caption1 font-semibold"
					rel="noopener"
				>
					개인정보 처리방침
				</a>
				<a
					href="https://depromeet.com/terms"
					target="_blank"
					className="underline text-gray-400 text-caption1 font-semibold"
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
						className="text-caption1 text-label-assistive font-medium"
						rel="noopener"
					>
						Instagram
					</a>
					<div className="w-px h-[10px] mx-2 bg-gray-400" />
					<a
						href="https://www.behance.net/Depromeet"
						target="_blank"
						className="text-caption1 text-label-assistive font-medium"
						rel="noopener"
					>
						Behance
					</a>
					<div className="w-px h-[10px] mx-2 bg-gray-400" />
					<a
						href="https://github.com/depromeet/"
						target="_blank"
						className="text-caption1 text-label-assistive font-medium"
						rel="noopener"
					>
						Github
					</a>
					<div className="w-px h-[10px] mx-2 bg-gray-400" />
					<a
						href="https://depromeet.medium.com/"
						target="_blank"
						className="text-caption1 text-label-assistive font-medium"
						rel="noopener"
					>
						Medium
					</a>
					<div className="w-px h-[10px] mx-2 bg-gray-400" />
					<a
						href="https://www.linkedin.com/company/depromeet/"
						target="_blank"
						className="text-caption1 text-label-assistive font-medium"
						rel="noopener"
					>
						LinkedIn
					</a>
				</div>
			</div>
		</footer>
	);
};

export { Footer };
