'use client';

import type { Bill } from '@dpm-core/api';
import { Badge, Button, ChevronRight, CopyIcon, toast } from '@dpm-core/shared';
import { useSuspenseQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { formatISOStringToCompactYearDate } from '@/lib/date';
import { getBillAccountbyId } from '@/remotes/queries/bill';
import { CopyToClipBoard } from '../../create/[billId]/_components/copy-to-clipboard';
import { formatAuthorityName } from '../utils/formatAuthorityName';

export const BillInformation = ({ bill }: { bill: Bill }) => {
	const {
		data: { data: billAccount },
	} = useSuspenseQuery(getBillAccountbyId(bill.billAccountId));

	return (
		<div className="flex flex-col gap-5">
			{/* 회식 이름 */}
			<h2 className="text-label-normal text-headline2 font-bold">{bill.title}</h2>

			{/* 회식 설명 */}
			{bill.description && (
				<p className="text-label-assistive text-body2 font-medium">{bill.description}</p>
			)}

			{/* 회식 날짜, 범위 */}
			<ul className="flex flex-col gap-3">
				<li className="flex items-center gap-4 text-body2">
					<p className="w-[70px] text-label-assistive font-semibold">회식 날짜</p>
					<p className="flex-1 text-label-subtle font-medium">
						{formatISOStringToCompactYearDate(bill.gatherings[0].heldAt)}
					</p>
				</li>
				<li className="flex items-center gap-4 ">
					<p className="w-[70px] text-body2 text-label-assistive font-semibold">초대 범위</p>
					<div className="flex items-center gap-1">
						{bill.inviteAuthorities.map((inviteAuthoritie) => (
							<Badge key={inviteAuthoritie.invitedAuthorityId} className="bg-background-strong">
								<span className="text-label-assistive mr-1">@</span>
								<span className="text-gray-500">
									{formatAuthorityName(inviteAuthoritie.authorityName)}
								</span>
							</Badge>
						))}
					</div>
				</li>

				{/* 송금 계좌 */}
				{bill.billStatus === 'IN_PROGRESS' && (
					<li className="flex items-center gap-4">
						<p className="w-[70px] text-body2 text-label-assistive font-semibold">송금 계좌</p>
						<p className="flex-1 text-body2 text-label-subtle font-medium flex gap-1">
							<span>{billAccount.billAccountValue}</span>
							<span>{billAccount.bankName}</span>
							<span>{billAccount.accountHolderName}</span>
						</p>
						<CopyToClipBoard
							text={billAccount.billAccountValue}
							onCopy={() => toast.success('계좌번호를 복사했습니다.')}
						>
							<Button className="text-icon-noraml mr-1" size="none" variant="none" asChild>
								<CopyIcon />
							</Button>
						</CopyToClipBoard>
					</li>
				)}
			</ul>

			{/* 회식 인원 */}
			{bill.billStatus === 'OPEN' ? (
				<Link
					href={`/bills/${bill.billId}/submit`}
					className="px-4 h-12 cursor-pointer flex items-center justify-between bg-primary-extralight rounded-[10px]"
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
							<p className="text-primary-normal">{bill.invitationSubmittedCount}</p>
							<span>/</span>
							<p className="text-label-subtle">{bill.invitedMemberCount}명 제출</p>
						</div>
					</div>
					<ChevronRight className="text-icon-noraml" />
				</Link>
			) : (
				<Link
					href={`/bills/${bill.billId}/final-amount`}
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
						<p className="text-label-subtle text-body2 font-semibold">멤버별 최종 금액</p>
					</div>
					<ChevronRight className="text-icon-noraml" />
				</Link>
			)}
		</div>
	);
};
