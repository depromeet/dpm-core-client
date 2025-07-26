const SettleDesc = () => {
	return (
		<div>
			{/* 위 */}
			<div className="px-4">
				<div className="px-4 py-3 bg-red-50 rounded-lg text-red-500 text-caption1 font-medium">
					모든 인원이 투표를 완료해야 정산이 원활하게 진행됩니다. <br />
					반드시 참석 여부를 선택해 주세요.
				</div>
			</div>

			{/* 아래 */}
			<div className="p-4 flex flex-col gap-5">
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
		</div>
	);
};

export default SettleDesc;
