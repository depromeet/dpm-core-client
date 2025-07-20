import React from 'react';

const FormStepItem = () => {
	return (
		<li className="py-5 relative px-4 border border-line-noraml rounded-lg flex flex-col gap-6">
			<div>
				{/* 닫기 버튼 */}
				<div className="w-fit p-1 ml-auto">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="12"
						height="12"
						viewBox="0 0 12 12"
						fill="none"
						className="cursor-pointer fill-current text-gray-400 hover:text-gray-600 transition-colors"
					>
						<title>icon</title>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M11.2803 0.209721C11.5732 0.502614 11.5732 0.977488 11.2803 1.27038L1.28033 11.2704C0.987437 11.5633 0.512563 11.5633 0.21967 11.2704C-0.0732233 10.9775 -0.0732233 10.5026 0.21967 10.2097L10.2197 0.209721C10.5126 -0.083172 10.9874 -0.083172 11.2803 0.209721Z"
						/>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M0.21967 0.209721C0.512563 -0.083172 0.987437 -0.083172 1.28033 0.209721L11.2803 10.2097C11.5732 10.5026 11.5732 10.9775 11.2803 11.2704C10.9874 11.5633 10.5126 11.5633 10.2197 11.2704L0.21967 1.27038C-0.0732233 0.977488 -0.0732233 0.502614 0.21967 0.209721Z"
						/>
					</svg>
				</div>

				{/* 차수 정보 */}
				<div className="flex flex-col gap-2">
					<h2 className="text-gray-600 text-body2 font-semibold">회식 차수 이름</h2>
					<input
						type="text"
						placeholder="ex. 1차  - 디프만 포차"
						className="p-4 rounded-lg text-gray-700 font-medium border text-body2  border-line-noraml outline-none focus:border-gray-600"
					/>
					<div className="flex items-center justify-between text-caption1 font-medium">
						<p className="text-red-400  invisible">필수 입력 값입니다.</p>
						<p className="flex justify-end text-gray-600 ">0/20자</p>
					</div>
				</div>
			</div>

			{/* 금액 */}
			<div className="flex flex-col gap-2">
				<h2 className="text-gray-600 text-body2 font-semibold">금액</h2>
				<input
					type="text"
					placeholder="금액 입력 (원)"
					className="outline-none px-3 py-2 text-title2 text-gray-800  font-semibold placeholder:text-gray-300 border-b border-line-noraml focus:border-gray-600"
				/>
				<p className="text-red-400 invisible text-caption1 font-medium">필수 입력 값입니다.</p>
			</div>
		</li>
	);
};

export default FormStepItem;
