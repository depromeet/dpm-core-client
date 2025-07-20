'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

const DetailStep = () => {
	const { settleId } = useParams();
	return (
		<li className="px-4 py-5 flex flex-col gap-4 border-b border-line-subtle">
			<h2 className="text-gray-600 text-body1 font-semibold ">#회식 차수 이름</h2>
			<div className="flex flex-col gap-2">
				<div className="px-5 py-3 rounded-[10px] bg-gray-50 flex flex-col gap-5">
					{/* 금액 */}
					<div className="flex flex-col gap-[6px] font-semibold">
						<p className="h-5 text-gray-400 text-caption1">금액</p>
						<div className="flex items-center gap-[6px]">
							<p className="text-gray-800 text-title2">총 800,000원</p>
							<p className="text-gray-400 text-body2">/인당 금액 미정</p>
						</div>
					</div>

					{/* 인원 */}
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-4">
							<p className="w-[70px] text-gray-400 text-body2 font-semibold">제출 전체</p>
							<p className="text-gray-600 text-body2 font-medium">00명</p>
						</div>
						<div className="flex items-center gap-4">
							<p className="w-[70px] text-gray-400 text-body2 font-semibold">참석</p>
							<p className="text-gray-600 text-body2 font-medium">00명</p>
						</div>
						<div className="flex items-center gap-4">
							<p className="w-[70px] text-gray-400 text-body2 font-semibold">참석 안함</p>
							<p className="text-gray-600 text-body2 font-medium">00명</p>
						</div>
					</div>
				</div>

				{/* 참석자 리스트 확인 */}
				<Link
					href={`/settle/${settleId}/attend`}
					className="px-4 h-12 cursor-pointer flex items-center justify-between bg-gray-100 rounded-[10px] "
				>
					<div className="flex items-center gap-1">
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
						<p className="text-gray-600 text-body2 font-semibold">참석자 리스트 확인</p>
					</div>
					<button type="button" className="cursor-pointer">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none"
						>
							<title>icon</title>
							<path
								d="M7.03033 2.46967C6.73744 2.17678 6.26268 2.17678 5.96978 2.46967C5.67689 2.76256 5.67689 3.23732 5.96978 3.53022L12.4395 9.99994L5.96978 16.4697L5.91803 16.5263C5.67772 16.8209 5.69518 17.2556 5.96978 17.5302C6.24439 17.8048 6.67911 17.8223 6.97369 17.582L7.03033 17.5302L14.0303 10.5302C14.3232 10.2373 14.3232 9.76256 14.0303 9.46967L7.03033 2.46967Z"
								fill="#9CA3AF"
							/>
						</svg>
					</button>
				</Link>
			</div>
		</li>
	);
};

export default DetailStep;
