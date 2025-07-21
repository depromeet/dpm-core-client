import FormStepList from './FormStepList';

const StepWrapper = () => {
	return (
		<>
			<div className="px-4 py-2 flex flex-col gap-2">
				<h2 className="text-title2 font-semibold text-gray-900">차수 정보</h2>
				<p className="text-gray-400 text-body2 font-medium">
					여러 차수를 추가할 경우, 차수와 장소가 <br /> 포함된 이름으로 차수를 구분해주세요.
				</p>
			</div>
			<div className="px-4 pt-4 pb-10 flex flex-col gap-6">
				<FormStepList />
				<button
					type="button"
					className="px-4 flex items-center cursor-pointer py-3 gap-[6px] max-w-max bg-gray-800 rounded-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 active:scale-95"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="13"
						height="13"
						viewBox="0 0 13 13"
						fill="none"
					>
						<title>Create Settle Button Icon</title>
						<path
							d="M0.416992 6.99805C0.416992 6.58383 0.752779 6.24805 1.16699 6.24805H12.8337C13.2479 6.24805 13.5837 6.58383 13.5837 6.99805C13.5837 7.41226 13.2479 7.74805 12.8337 7.74805H1.16699C0.752779 7.74805 0.416992 7.41226 0.416992 6.99805Z"
							fill="#fff"
						/>
						<path
							d="M7 0.415039C7.41421 0.415039 7.75 0.750825 7.75 1.16504V12.8317C7.75 13.2459 7.41421 13.5817 7 13.5817C6.58579 13.5817 6.25 13.2459 6.25 12.8317V1.16504C6.25 0.750825 6.58579 0.415039 7 0.415039Z"
							fill="#fff"
						/>
					</svg>
					<span className="text-white font-semibold text-body2">차수 추가</span>
				</button>
			</div>
		</>
	);
};

export default StepWrapper;
