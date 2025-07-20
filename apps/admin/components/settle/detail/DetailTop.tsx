'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

const DetailTop = () => {
	const { settleId } = useParams();
	return (
		<div className="p-4 flex flex-col gap-8">
			<div className="px-4 py-3 flex items-center gap-5 bg-gray-50 rounded-lg">
				<div className="flex flex-col gap-[6px] items-center justify-center">
					<div className="size-8 rounded-full bg-gray-200 flex items-center justify-center">
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
								d="M14 13.4196C14 14.5915 13.25 15.001 8 15.001C2.75 15.001 2 14.5915 2 13.4196C2 12.2477 2.63214 11.1238 3.75736 10.2952C4.88258 9.46651 6.4087 9.00098 8 9.00098C9.5913 9.00098 11.1174 9.46651 12.2426 10.2952C13.3679 11.1238 14 12.2477 14 13.4196Z"
								fill="#9CA3AF"
							/>
						</svg>
					</div>
					<p className="text-gray-500 font-semibold text-caption1">멤버 확정 전</p>
				</div>
				<div className="w-px bg-line-normal h-9 flex items-center" />
				<p className="text-gray-600 text-body2 font-medium">
					초대 멤버 전원이 참석 여부를 제출하면 <br />
					멤버를 확정할 수 있어요.
				</p>
			</div>

			<div className="flex flex-col gap-5">
				{/* 회식 이름 */}
				<h2 className="text-gray-800 text-headline2 font-bold">17기 OT세션 공식 회식</h2>

				{/* 회식 설명 */}
				<p className="text-gray-400 text-body2 font-medium">
					회식설명 어쩌고 저쩌고 회식설명 어쩌고 저쩌고 회식설명 어쩌고 저쩌고 회식설명 어쩌고
					저쩌고 회식설명 어쩌고 저쩌고 회식설명 어쩌고 저쩌고 회식설명 어쩌고 저쩌고 회식설명
					어쩌고 저쩌고 회식설명 어쩌고 저쩌고
				</p>

				{/* 회식 날짜, 범위 */}
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

				{/* 회식 인원 */}
				<Link
					href={`/settle/${settleId}/submit`}
					className="px-4 h-12 cursor-pointer flex items-center justify-between bg-blue-50 rounded-[10px] "
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
								fill="#5E83FE"
							/>
							<path
								d="M14 13.4187C14 14.5906 13.25 15 8 15C2.75 15 2 14.5906 2 13.4187C2 12.2468 2.63214 11.1229 3.75736 10.2942C4.88258 9.46554 6.4087 9 8 9C9.5913 9 11.1174 9.46554 12.2426 10.2942C13.3679 11.1229 14 12.2468 14 13.4187Z"
								fill="#5E83FE"
							/>
						</svg>
						<div className="flex items-center gap-[2px] text-body2 font-semibold">
							<p className="text-blue-400">27</p>
							<p>/</p>
							<p className="text-gray-600">70명 제출</p>
						</div>
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
		</div>
	);
};

export default DetailTop;
