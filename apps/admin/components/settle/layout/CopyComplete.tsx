
const CopyComplete = () => {
	return (
		<div className="fixed top-0 left-1/2 -translate-x-1/2 z-[9999] w-fit ">
			<div className="bg-gray-800 top-3 px-4 py-3 rounded-[100px] gap-2 flex items-center justify-center ">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
				>
					<title>icon</title>
					<path
						d="M10 2.00006C14.4183 2.00006 17.9999 5.5818 18 10.0001C18 14.4184 14.4183 18.0001 10 18.0001C5.58174 18 2 14.4183 2 10.0001C2.0001 5.58186 5.5818 2.00017 10 2.00006ZM13.1396 7.38971C12.8308 7.05509 12.3294 7.0551 12.0205 7.38971L8.88867 10.7823L7.86621 9.67487C7.55735 9.34034 7.0569 9.34033 6.74805 9.67487C6.43917 10.0095 6.43917 10.5522 6.74805 10.8868L8.33008 12.6006C8.63891 12.9348 9.13947 12.9349 9.44824 12.6006L13.1396 8.60162C13.4483 8.26702 13.4484 7.72426 13.1396 7.38971Z"
						fill="#5E83FE"
					/>
				</svg>
				<p className="text-body1 text-white font-medium ">최종 정산 링크를 복사했습니다.</p>
			</div>
		</div>
	);
};

export default CopyComplete;
