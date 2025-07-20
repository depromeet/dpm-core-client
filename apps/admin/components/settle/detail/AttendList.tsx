import React from 'react';

const AttendList = () => {
	return (
		<ul className="flex flex-col my-2 pt-12">
			{[1, 2, 3, 4, 5].map((item) => (
				<li key={item} className="px-4 py-3 flex items-center gap-4">
					<div className="size-10 rounded-full bg-gray-100 flex items-center justify-center">
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
								fill="#9CA3AF"
							/>
							<path
								d="M14 13.4187C14 14.5906 13.25 15 8 15C2.75 15 2 14.5906 2 13.4187C2 12.2468 2.63214 11.1229 3.75736 10.2942C4.88258 9.46554 6.4087 9 8 9C9.5913 9 11.1174 9.46554 12.2426 10.2942C13.3679 11.1229 14 12.2468 14 13.4187Z"
								fill="#9CA3AF"
							/>
						</svg>
					</div>
					<div className="flex-1 flex items-center ">
						<div className="flex-1 flex flex-col gap-[2px]">
							<p className="text-gray-800 text-body1 font-semibold">임효진</p>
							<div className="flex items-center gap-[6px] text-gray-400 text-caption1 font-medium">
								<p>1조</p>
								<p>디자이너</p>
							</div>
						</div>
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
									d="M8 1.60156C11.5347 1.60156 14.4004 4.46728 14.4004 8.00195C14.4002 11.5364 11.5345 14.4014 8 14.4014C4.46553 14.4013 1.59985 11.5364 1.59961 8.00195C1.59961 4.46732 4.46538 1.60163 8 1.60156ZM10.5117 5.91309C10.2646 5.64539 9.86331 5.64539 9.61621 5.91309L7.11133 8.62695L6.29297 7.74121C6.04588 7.47358 5.64553 7.47359 5.39844 7.74121C5.15134 8.0089 5.15134 8.44324 5.39844 8.71094L6.66406 10.0811C6.91116 10.3487 7.31149 10.3487 7.55859 10.0811L10.5117 6.88281C10.7587 6.61514 10.7587 6.18076 10.5117 5.91309Z"
									fill="#5E83FE"
								/>
							</svg>
							<p className="text-gray-600 text-body2 font-semibold">참석함</p>
						</div>
					</div>
				</li>
			))}

			{[1, 2, 3, 4, 5].map((item) => (
				<li key={item} className="px-4 py-3 flex items-center gap-4">
					<div className="size-10 rounded-full bg-gray-100 flex items-center justify-center">
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
								fill="#9CA3AF"
							/>
							<path
								d="M14 13.4187C14 14.5906 13.25 15 8 15C2.75 15 2 14.5906 2 13.4187C2 12.2468 2.63214 11.1229 3.75736 10.2942C4.88258 9.46554 6.4087 9 8 9C9.5913 9 11.1174 9.46554 12.2426 10.2942C13.3679 11.1229 14 12.2468 14 13.4187Z"
								fill="#9CA3AF"
							/>
						</svg>
					</div>
					<div className="flex-1 flex items-center ">
						<div className="flex-1 flex flex-col gap-[2px]">
							<p className="text-gray-800 text-body1 font-semibold">임효진</p>
							<div className="flex items-center gap-[6px] text-gray-400 text-caption1 font-medium">
								<p>1조</p>
								<p>디자이너</p>
							</div>
						</div>
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
									d="M8.0001 1.60156C4.46547 1.60156 1.6001 4.46694 1.6001 8.00156C1.6001 11.5362 4.46547 14.4016 8.0001 14.4016C11.5347 14.4016 14.4001 11.5362 14.4001 8.00156C14.4001 4.46694 11.5347 1.60156 8.0001 1.60156ZM7.02436 6.1773C6.79005 5.94298 6.41015 5.94298 6.17583 6.1773C5.94152 6.41161 5.94152 6.79151 6.17583 7.02583L7.15157 8.00156L6.17583 8.9773C5.94152 9.21161 5.94152 9.59151 6.17583 9.82583C6.41015 10.0601 6.79005 10.0601 7.02436 9.82583L8.0001 8.85009L8.97583 9.82583C9.21015 10.0601 9.59005 10.0601 9.82436 9.82583C10.0587 9.59151 10.0587 9.21161 9.82436 8.9773L8.84863 8.00156L9.82436 7.02583C10.0587 6.79151 10.0587 6.41161 9.82436 6.1773C9.59005 5.94298 9.21015 5.94298 8.97583 6.1773L8.0001 7.15303L7.02436 6.1773Z"
									fill="#FF7070"
								/>
							</svg>
							<p className="text-gray-600 text-body2 font-semibold">참석 안함</p>
						</div>
					</div>
				</li>
			))}
		</ul>
	);
};

export default AttendList;
