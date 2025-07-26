const AttendBottomSheet = () => {
	return (
		<div className="max-w-lg mx-auto fixed bottom-0 z-9999 w-full bg-white">
			<div className="px-5 pt-[30px] pb-5 rounded-t-[20px] flex flex-col gap-8">
				{/* contents */}
				<div className="flex flex-col gap-3 ">
					<h2 className="text-title2 text-gray-800 font-semibold ">제출 전 확인</h2>
					<div className="flex flex-col">
						<p className="text-gray-600 text-body1 font-semibold mb-2">17기 OT세션 공식 회식</p>
						<ul className="flex flex-col gap-3 mb-5 px-5 py-3 rounded-lg bg-gray-50">
							<li className="flex items-center gap-4">
								<p className="w-[70px] text-gray-500 text-body2 font-semibold">1차</p>
								<div className="flex items-center gap-[2px]">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="17"
										height="16"
										viewBox="0 0 17 16"
										fill="none"
									>
										<title>icon</title>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M8.5001 1.60156C4.96547 1.60156 2.1001 4.46694 2.1001 8.00156C2.1001 11.5362 4.96547 14.4016 8.5001 14.4016C12.0347 14.4016 14.9001 11.5362 14.9001 8.00156C14.9001 4.46694 12.0347 1.60156 8.5001 1.60156ZM7.52436 6.1773C7.29005 5.94298 6.91015 5.94298 6.67583 6.1773C6.44152 6.41161 6.44152 6.79151 6.67583 7.02583L7.65157 8.00156L6.67583 8.9773C6.44152 9.21161 6.44152 9.59151 6.67583 9.82583C6.91015 10.0601 7.29005 10.0601 7.52436 9.82583L8.5001 8.85009L9.47583 9.82583C9.71015 10.0601 10.09 10.0601 10.3244 9.82583C10.5587 9.59151 10.5587 9.21161 10.3244 8.9773L9.34863 8.00156L10.3244 7.02583C10.5587 6.79151 10.5587 6.41161 10.3244 6.1773C10.09 5.94298 9.71015 5.94298 9.47583 6.1773L8.5001 7.15303L7.52436 6.1773Z"
											fill="#FF7070"
										/>
									</svg>
									<p>참석 안함</p>
								</div>
							</li>
							<li className="flex items-center gap-4">
								<p className="w-[70px] text-gray-500 text-body2 font-semibold">1차</p>
								<div className="flex items-center gap-[2px]">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="17"
										height="16"
										viewBox="0 0 17 16"
										fill="none"
									>
										<title>icon</title>
										<path
											d="M8.5 1.60303C12.0347 1.60303 14.9004 4.46874 14.9004 8.00342C14.9002 11.5379 12.0345 14.4028 8.5 14.4028C4.96553 14.4028 2.09985 11.5378 2.09961 8.00342C2.09961 4.46879 4.96538 1.6031 8.5 1.60303ZM11.0117 5.91455C10.7646 5.64686 10.3633 5.64686 10.1162 5.91455L7.61133 8.62842L6.79297 7.74268C6.54588 7.47505 6.14553 7.47505 5.89844 7.74268C5.65134 8.01037 5.65134 8.44471 5.89844 8.7124L7.16406 10.0825C7.41116 10.3502 7.81149 10.3502 8.05859 10.0825L11.0117 6.88428C11.2587 6.6166 11.2587 6.18222 11.0117 5.91455Z"
											fill="#5E83FE"
										/>
									</svg>
									<p>참석함</p>
								</div>
							</li>
						</ul>
						<ul className="text-gray-600 text-body2 font-medium">
							<li>- 참석 여부는 모든 디퍼에게 공개됩니다. </li>
							<li>
								- 멤버 확정 후에는 <span className="text-red-500 ">수정이 불가능</span>하니, 제출 전
								한 번 더 확인해 주세요.
							</li>
						</ul>
					</div>
				</div>

				{/* 수정 제출 버튼 */}
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
						제출하기
					</button>
				</div>
			</div>

			{/* 닫기 버튼 */}
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
						fillRule="evenodd"
						clipRule="evenodd"
						d="M11.2803 0.209721C11.5732 0.502614 11.5732 0.977488 11.2803 1.27038L1.28033 11.2704C0.987437 11.5633 0.512563 11.5633 0.21967 11.2704C-0.0732233 10.9775 -0.0732233 10.5026 0.21967 10.2097L10.2197 0.209721C10.5126 -0.083172 10.9874 -0.083172 11.2803 0.209721Z"
						fill="#9CA3AF"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M0.21967 0.209721C0.512563 -0.083172 0.987437 -0.083172 1.28033 0.209721L11.2803 10.2097C11.5732 10.5026 11.5732 10.9775 11.2803 11.2704C10.9874 11.5633 10.5126 11.5633 10.2197 11.2704L0.21967 1.27038C-0.0732233 0.977488 -0.0732233 0.502614 0.21967 0.209721Z"
						fill="#9CA3AF"
					/>
				</svg>
			</button>
		</div>
	);
};

export default AttendBottomSheet;
