import type { BillStatus, Gathering } from '@dpm-core/api';
import { ChevronRight } from '@dpm-core/shared';
import Link from 'next/link';
import { formatPrice } from '../utils/formatPrice';

export const GatheringItem = ({
	billStatus,
	gathering,
	invitationSubmittedCount,
}: {
	billStatus: BillStatus;
	gathering: Gathering;
	invitationSubmittedCount: number;
}) => {
	return (
		<li className="px-4 py-5 flex flex-col gap-4 border-b last:border-b-0 border-line-subtle">
			<h2 className="text-label-subtle text-body1 font-semibold ">#{gathering.title}</h2>
			<div className="flex flex-col gap-2">
				<div className="px-5 py-3 rounded-[10px] bg-gray-50 flex flex-col gap-5">
					{/* 금액 */}
					{billStatus === 'OPEN' ? (
						<div className="flex flex-col gap-[6px] font-semibold">
							<p className="h-5 text-label-assistive text-caption1">금액</p>
							<div className="flex items-center gap-[6px]">
								<p className="text-gray-800 text-title2">총 {formatPrice(gathering.amount)}원</p>
								<p className="text-label-assistive text-body2">/인당 금액 미정</p>
							</div>
						</div>
					) : (
						<div className="flex flex-col gap-[6px] font-semibold">
							<p className="h-5 text-label-assistive text-caption1">금액</p>
							<div className="flex items-center gap-[6px]">
								<p className="text-gray-800 text-title2">
									인당 {formatPrice(gathering.splitAmount)}원
								</p>
								<p className="text-label-assistive text-body2">
									/총 {formatPrice(gathering.amount)}원
								</p>
							</div>
						</div>
					)}

					{/* 인원 */}
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-4">
							<p className="w-[70px] text-label-assistive text-body2 font-semibold">참석</p>
							<p className="text-label-subtle text-body2 font-medium">
								{formatTwoDigits(gathering.joinMemberCount)}명
							</p>
						</div>
						<div className="flex items-center gap-4">
							<p className="w-[70px] text-label-assistive text-body2 font-semibold">참석 안함</p>
							<p className="text-label-subtle text-body2 font-medium">
								{formatTwoDigits(invitationSubmittedCount - gathering.joinMemberCount)}명
							</p>
						</div>
					</div>
				</div>

				{/* 참석자 리스트 확인 */}

				<Link
					href={`/bills/gatherings/${gathering.gatheringId}`}
					className="px-4 h-12 cursor-pointer flex items-center justify-between bg-gray-100 rounded-[10px] "
				>
					{billStatus === 'OPEN' ? (
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
							<p className="text-label-subtle text-body2 font-semibold">참석자 리스트 확인</p>
						</div>
					) : (
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
								<p className="text-primary-normal">{formatTwoDigits(gathering.joinMemberCount)}</p>
								<span>/</span>
								<p className="text-label-subtle">
									{formatTwoDigits(invitationSubmittedCount)}명 참석
								</p>
							</div>
						</div>
					)}

					<ChevronRight className="text-icon-noraml" />
				</Link>
			</div>
		</li>
	);
};

const formatTwoDigits = (value: number | string) => {
	const num = typeof value === 'string' ? Number(value) : value;
	if (Number.isNaN(num)) return '';

	return String(num).padStart(2, '0');
};
