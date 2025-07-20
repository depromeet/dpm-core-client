import React from 'react';

const SubmitList = () => {
	return (
		<div className="pt-24">
			<ul className="flex flex-col my-2">
				{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
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

						<div className="flex flex-col gap-[2px]">
							<p className="text-gray-800 text-body1 font-semibold">임효진</p>
							<div className="flex items-center gap-[6px] text-gray-400 text-caption1 font-medium">
								<p>1조</p>
								<p>디자이너</p>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default SubmitList;
