const DetailTop = () => {
	return (
		<div>
			{/* 위 */}
			<div className="p-4">
				<div className="px-4 py-3 flex items-center gap-5 bg-gray-50 rounded-lg">
					<div className="flex flex-col gap-[6px] items-center justify-center w-16">
						<div className="size-8 bg-blue-400 rounded-full flex items-center gap-1 justify-center">
							{[1, 2, 3].map((item) => (
								<svg
									key={item}
									xmlns="http://www.w3.org/2000/svg"
									width="3"
									height="3"
									viewBox="0 0 3 3"
									fill="none"
								>
									<title>icon</title>
									<circle cx="1.5" cy="1.5" r="1.5" fill="white" />
								</svg>
							))}
						</div>
						<p className="text-caption1 text-blue-400 font-semibold">정산 중</p>
					</div>
					<div className="w-px bg-line-normal h-9 flex items-center" />
					<p className="text-gray-600 text-body2 font-medium">
						송금하실 금액과 계좌를 확인 후 <br />
						입금해 주세요.
					</p>
				</div>
			</div>

			{/* 아래 */}
			<div className="p-4 flex flex-col gap-8">
				<div className="flex flex-col gap-5">
					{/* 정산서 제목 */}
					<h2 className="text-headline2 text-gray-800 font-bold">17기 OT세션 공식 회식</h2>

					{/* 정산서 설명 */}
					<p className="text-body2 font-medium text-gray-500">
						회식설명 어쩌고 저쩌고 회식설명 어쩌고 저쩌고 회식설명 어쩌고 저쩌고 회식설명 어쩌고
						저쩌고 회식설명 어쩌고 저쩌고 회식설명 어쩌고 저쩌고 회식설명 어쩌고 저쩌고 회식설명
						어쩌고 저쩌고 회식설명 어쩌고 저쩌고
					</p>

					{/* 정산서 날짜 */}
					<ul className="flex flex-col gap-3">
						<li className="flex items-center gap-4 text-body2">
							<p className="w-[70px] text-gray-500 font-semibold">회식 날짜</p>
							<p className="flex-1 text-gray-600 font-medium">25년 00월 00일 (토)</p>
						</li>
						<li className="flex items-center gap-4">
							<p className="w-[70px] text-body2 text-gray-500 font-semibold">초대 범위</p>
							<div className="flex items-center gap-1">
								<div className="flex items-center gap-1 py-[3px] px-[5px] bg-gray-100 text-caption1 font-semibold rounded-[4px] ">
									<p className="text-gray-400 ">@</p>
									<p className="text-gray-500 ">17기 운영진</p>
								</div>
								<div className="flex items-center gap-1 py-[3px] px-[5px] bg-gray-100 text-caption1 font-semibold rounded-[4px] ">
									<p className="text-gray-400 ">@</p>
									<p className="text-gray-500 ">17기 디퍼</p>
								</div>
							</div>
						</li>
					</ul>
				</div>
				<div className="px-5 py-3 rounded-[10px] bg-blue-50 flex flex-col gap-3">
					<div className="flex items-center justify-between">
						<p className="text-gray-600 text-body2 font-semibold">복사해서 편하게 송금하기</p>
						<button
							type="button"
							className="cursor-pointer duration-200 text-gray-400 hover:text-gray-600"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="15"
								height="16"
								viewBox="0 0 15 16"
								fill="none"
							>
								<title>icon</title>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M6.3125 5.875C5.9328 5.875 5.625 6.1828 5.625 6.5625V12.8125C5.625 13.1922 5.9328 13.5 6.3125 13.5H12.5625C12.9422 13.5 13.25 13.1922 13.25 12.8125V6.5625C13.25 6.1828 12.9422 5.875 12.5625 5.875H6.3125ZM4.5 6.5625C4.5 5.56148 5.31148 4.75 6.3125 4.75H12.5625C13.5635 4.75 14.375 5.56148 14.375 6.5625V12.8125C14.375 13.8135 13.5635 14.625 12.5625 14.625H6.3125C5.31148 14.625 4.5 13.8135 4.5 12.8125V6.5625Z"
									fill="currentColor"
								/>
								<path
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="M2.5625 2.125C2.18566 2.125 1.875 2.43566 1.875 2.8125V9.0625C1.875 9.43934 2.18566 9.75 2.5625 9.75C2.87316 9.75 3.125 10.0018 3.125 10.3125C3.125 10.6232 2.87316 10.875 2.5625 10.875C1.56434 10.875 0.75 10.0607 0.75 9.0625V2.8125C0.75 1.81434 1.56434 1 2.5625 1H8.8125C9.81066 1 10.625 1.81434 10.625 2.8125C10.625 3.12316 10.3732 3.375 10.0625 3.375C9.75184 3.375 9.5 3.12316 9.5 2.8125C9.5 2.43566 9.18934 2.125 8.8125 2.125H2.5625Z"
									fill="currentColor"
								/>
							</svg>
						</button>
					</div>
					<div className="h-px w-full bg-blue-100" />
					<div className="flex flex-col gap-[6px]">
						<p className="text-gray-500 text-caption1 font-semibold ">내가 낼 금액</p>
						<p className="text-blue-400 text-headline1 font-bold">20,000원</p>
					</div>
					<div className="flex flex-col gap-[6px]">
						<p className="text-gray-500 text-caption1 font-semibold">송금할 계좌</p>
						<p className="text-gray-600 font-semibold text-body1">1001 9271 5621 토스뱅크 장다혜</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DetailTop;
