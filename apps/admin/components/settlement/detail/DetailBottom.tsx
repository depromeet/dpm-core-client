import Link from 'next/link';

const DetailBottom = () => {
	return (
		<div className="mb-4">
			<div className="px-4 py-2 text-title2 text-gray-900 font-semibold">회식 참석 현황</div>
			<ul className="flex flex-col ">
				<li className="px-4 py-5 flex flex-col gap-4 border-b border-line-subtle">
					<div className="flex items-center justify-between">
						<p className="text-gray-600 text-body1 font-semibold">회식 차수 이름</p>
						<div className="flex items-center gap-[2px]">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
							>
								<title>icon</title>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M8.0001 1.60254C4.46547 1.60254 1.6001 4.46792 1.6001 8.00254C1.6001 11.5372 4.46547 14.4025 8.0001 14.4025C11.5347 14.4025 14.4001 11.5372 14.4001 8.00254C14.4001 4.46792 11.5347 1.60254 8.0001 1.60254ZM7.02436 6.17828C6.79005 5.94396 6.41015 5.94396 6.17583 6.17828C5.94152 6.41259 5.94152 6.79249 6.17583 7.0268L7.15157 8.00254L6.17583 8.97827C5.94152 9.21259 5.94152 9.59249 6.17583 9.8268C6.41015 10.0611 6.79005 10.0611 7.02436 9.8268L8.0001 8.85107L8.97583 9.8268C9.21015 10.0611 9.59005 10.0611 9.82436 9.8268C10.0587 9.59249 10.0587 9.21259 9.82436 8.97827L8.84863 8.00254L9.82436 7.0268C10.0587 6.79249 10.0587 6.41259 9.82436 6.17828C9.59005 5.94396 9.21015 5.94396 8.97583 6.17828L8.0001 7.15401L7.02436 6.17828Z"
									fill="#FF7070"
								/>
							</svg>
							<p className="text-body2 text-gray-600 font-semibold">참석 안함</p>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<div className="px-5 py-3 flex flex-col gap-[6px] bg-gray-50">
							<p className="text-caption1 text-gray-500 font-semibold">금액</p>
							<div className="flex items-center gap-[6px]">
								<p className="text-title2 text-gray-800 font-semibold">인당 80,000원</p>
								<p className="text-body2 font-semibold text-gray-500">/총 800,000원</p>
							</div>
						</div>
						<Link
							href={`/`}
							className="px-4 h-12 cursor-pointer flex items-center justify-between bg-gray-100 rounded-[10px] "
						>
							<div className="flex items-center gap-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
								>
									<title>icon</title>
									<path
										d="M7.78739 7.78572C9.38507 7.78572 10.6802 6.49054 10.6802 4.89286C10.6802 3.29518 9.38507 2 7.78739 2C6.18971 2 4.89453 3.29518 4.89453 4.89286C4.89453 6.49054 6.18971 7.78572 7.78739 7.78572Z"
										fill="#5E83FE"
									/>
									<path
										d="M14 13.4187C14 14.5906 13.25 15 8 15C2.75 15 2 14.5906 2 13.4187C2 12.2468 2.63214 11.1229 3.75736 10.2942C4.88258 9.46554 6.4087 9 8 9C9.5913 9 11.1174 9.46554 12.2426 10.2942C13.3679 11.1229 14 12.2468 14 13.4187Z"
										fill="#5E83FE"
									/>
								</svg>
								<div className="flex items-center gap-[2px] text-body2 font-semibold">
									<p className="text-blue-400">27</p>
									<p>/</p>
									<p className="text-gray-600">70명 제출</p>
								</div>
							</div>
							<button type="button" className="cursor-pointer">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
								>
									<title>icon</title>
									<path
										d="M7.03033 2.46967C6.73744 2.17678 6.26268 2.17678 5.96978 2.46967C5.67689 2.76256 5.67689 3.23732 5.96978 3.53022L12.4395 9.99994L5.96978 16.4697L5.91803 16.5263C5.67772 16.8209 5.69518 17.2556 5.96978 17.5302C6.24439 17.8048 6.67911 17.8223 6.97369 17.582L7.03033 17.5302L14.0303 10.5302C14.3232 10.2373 14.3232 9.76256 14.0303 9.46967L7.03033 2.46967Z"
										fill="#9CA3AF"
									/>
								</svg>
							</button>
						</Link>
					</div>
				</li>

				<li className="px-4 py-5 flex flex-col gap-4 ">
					<div className="flex items-center justify-between">
						<p className="text-gray-600 text-body1 font-semibold">회식 차수 이름</p>
						<div className="flex items-center gap-[2px]">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
							>
								<title>icon</title>
								<path
									d="M8 1.60352C11.5347 1.60352 14.4004 4.46923 14.4004 8.00391C14.4002 11.5384 11.5345 14.4033 8 14.4033C4.46553 14.4032 1.59985 11.5383 1.59961 8.00391C1.59961 4.46927 4.46538 1.60359 8 1.60352ZM10.5117 5.91504C10.2646 5.64735 9.86331 5.64735 9.61621 5.91504L7.11133 8.62891L6.29297 7.74316C6.04588 7.47554 5.64553 7.47554 5.39844 7.74316C5.15134 8.01086 5.15134 8.4452 5.39844 8.71289L6.66406 10.083C6.91116 10.3507 7.31149 10.3507 7.55859 10.083L10.5117 6.88477C10.7587 6.61709 10.7587 6.18271 10.5117 5.91504Z"
									fill="#5E83FE"
								/>
							</svg>
							<p className="text-body2 text-gray-600 font-semibold">참석함</p>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<div className="px-5 py-3 flex flex-col gap-[6px] bg-gray-50">
							<p className="text-caption1 text-gray-500 font-semibold">금액</p>
							<div className="flex items-center gap-[6px]">
								<p className="text-title2 text-gray-800 font-semibold">인당 80,000원</p>
								<p className="text-body2 font-semibold text-gray-500">/총 800,000원</p>
							</div>
						</div>
						<Link
							href={`/`}
							className="px-4 h-12 cursor-pointer flex items-center justify-between bg-gray-100 rounded-[10px] "
						>
							<div className="flex items-center gap-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
								>
									<title>icon</title>
									<path
										d="M7.78739 7.78572C9.38507 7.78572 10.6802 6.49054 10.6802 4.89286C10.6802 3.29518 9.38507 2 7.78739 2C6.18971 2 4.89453 3.29518 4.89453 4.89286C4.89453 6.49054 6.18971 7.78572 7.78739 7.78572Z"
										fill="#5E83FE"
									/>
									<path
										d="M14 13.4187C14 14.5906 13.25 15 8 15C2.75 15 2 14.5906 2 13.4187C2 12.2468 2.63214 11.1229 3.75736 10.2942C4.88258 9.46554 6.4087 9 8 9C9.5913 9 11.1174 9.46554 12.2426 10.2942C13.3679 11.1229 14 12.2468 14 13.4187Z"
										fill="#5E83FE"
									/>
								</svg>
								<div className="flex items-center gap-[2px] text-body2 font-semibold">
									<p className="text-blue-400">27</p>
									<p>/</p>
									<p className="text-gray-600">70명 제출</p>
								</div>
							</div>
							<button type="button" className="cursor-pointer">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
								>
									<title>icon</title>
									<path
										d="M7.03033 2.46967C6.73744 2.17678 6.26268 2.17678 5.96978 2.46967C5.67689 2.76256 5.67689 3.23732 5.96978 3.53022L12.4395 9.99994L5.96978 16.4697L5.91803 16.5263C5.67772 16.8209 5.69518 17.2556 5.96978 17.5302C6.24439 17.8048 6.67911 17.8223 6.97369 17.582L7.03033 17.5302L14.0303 10.5302C14.3232 10.2373 14.3232 9.76256 14.0303 9.46967L7.03033 2.46967Z"
										fill="#9CA3AF"
									/>
								</svg>
							</button>
						</Link>
					</div>
				</li>
			</ul>
		</div>
	);
};

export default DetailBottom;
