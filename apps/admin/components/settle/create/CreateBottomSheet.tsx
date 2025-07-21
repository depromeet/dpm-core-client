
const CreateBottomSheet = () => {
	return (
		<div className="max-w-lg mx-auto fixed bottom-0 z-9999 relative bg-white">
			<div className="px-5 pt-[30px] pb-5 rounded-t-[20px] flex flex-col gap-8">
				<div className="flex flex-col gap-3 ">
					<h2 className="text-title2 text-gray-800 font-semibold">생성 전 확인</h2>
					<p className="text-body2 text-gray-600 font-medium">
						정산서를 생성하시겠어요? MVP 단계에서는 생성 후 수정이 <br /> 어려우니, 한 번 더 확인해
						주세요.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<button
						type="button"
						className="flex-1 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-body1 text-gray-800 font-semibold"
					>
						수정하기
					</button>
					<button
						type="button"
						className="flex-1 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-body1 text-white font-semibold"
					>
						생성하기
					</button>
				</div>
			</div>
			<button
				type="button"
				className="cursor-pointer absolute top-4 right-4 bg-gray-100 rounded-full size-[28px] flex items-center justify-center"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
				>
					<title>icon</title>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M11.2803 0.209721C11.5732 0.502614 11.5732 0.977488 11.2803 1.27038L1.28033 11.2704C0.987437 11.5633 0.512563 11.5633 0.21967 11.2704C-0.0732233 10.9775 -0.0732233 10.5026 0.21967 10.2097L10.2197 0.209721C10.5126 -0.083172 10.9874 -0.083172 11.2803 0.209721Z"
						fill="#9CA3AF"
					/>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M0.21967 0.209721C0.512563 -0.083172 0.987437 -0.083172 1.28033 0.209721L11.2803 10.2097C11.5732 10.5026 11.5732 10.9775 11.2803 11.2704C10.9874 11.5633 10.5126 11.5633 10.2197 11.2704L0.21967 1.27038C-0.0732233 0.977488 -0.0732233 0.502614 0.21967 0.209721Z"
						fill="#9CA3AF"
					/>
				</svg>
			</button>
		</div>
	);
};

export default CreateBottomSheet;
