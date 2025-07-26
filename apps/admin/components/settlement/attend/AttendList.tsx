const AttendList = () => {
	return (
		<ul className="mb-8">
			<li className="px-4 py-8 flex flex-col gap-3">
				<p className="text-gray-600 font-semibold text-body1">#회식 차수 이름</p>
				<div className="flex items-center border rounded-lg border-line-normal text-body2">
					<button
						type="button"
						className="flex-1 px-3 cursor-pointer h-12 py-[10px] flex items-center text-gray-500 font-medium justify-center"
					>
						참석 안함
					</button>
					<button
						type="button"
						className="flex-1 px-3 cursor-pointer h-12 py-[10px] flex items-center justify-center bg-blue-50 text-blue-400 font-semibold"
					>
						참석함
					</button>
				</div>
			</li>

			<li className="px-4 py-8 flex flex-col gap-3">
				<p className="text-gray-600 font-semibold text-body1">#회식 차수 이름</p>
				<div className="flex items-center border rounded-lg border-line-normal text-body2">
					<button
						type="button"
						className="flex-1 px-3 cursor-pointer h-12 py-[10px] flex items-center bg-gray-50 text-gray-600 font-semibold justify-center"
					>
						참석 안함
					</button>
					<button
						type="button"
						className="flex-1 px-3 cursor-pointer h-12 py-[10px] flex items-center justify-center text-gray-500 font-medium"
					>
						참석함
					</button>
				</div>
			</li>
		</ul>
	);
};

export default AttendList;
