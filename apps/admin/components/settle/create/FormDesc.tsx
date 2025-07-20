const FormDesc = () => {
	return (
		<div className="flex flex-col gap-2">
			<div className="h-5 flex items-center gap-1 text-gray-600 text-body2 font-semibold">
				정산서 이름
				<span className="text-caption1 font-medium text-gray-400">(선택)</span>
			</div>
			<textarea
				placeholder="ex. OT 회식 1차 -3차 정산서입니다. "
				className="px-4 py-3 rounded-md h-40 rounded-lg text-gray-700 font-medium border text-body2  border-line-normal outline-none focus:border-gray-600"
			/>
			<p className="flex justify-end text-gray-600 text-caption1 font-medium ">0/50자</p>
		</div>
	);
};

export default FormDesc;
