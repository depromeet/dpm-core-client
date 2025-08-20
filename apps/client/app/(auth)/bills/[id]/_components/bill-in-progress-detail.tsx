'use client';

import type { Bill } from '@dpm-core/api';
import { CopyButton, Divider, formatDotFullDate, toast } from '@dpm-core/shared';
import { AppHeader } from '@/components/app-header';

const BillInProgressDetail = ({ billDetail }: { billDetail: Bill }) => {
	const totalMemberCount = billDetail.inviteAuthorities.reduce(
		(acc, cur) => acc + cur.authorityMemberCount,
		0,
	);

	return (
		<>
			<AppHeader title="정산서" className="mb-1.5" />
			<div className="p-4">
				<BillDetailHeader />
			</div>

			<div className="flex flex-col p-4 gap-y-5">
				<h3 className="text-headline2 font-bold text-label-normal">{billDetail.title}</h3>
				{billDetail.description ? (
					<p className="text-body2 text-label-assistive font-medium">{billDetail.description}</p>
				) : null}
				<div className="flex flex-col gap-y-3">
					<div className="flex gap-4 text-body2">
						<p className="w-17.5 font-semibold text-label-assistive shrink-0">회식 날짜</p>
						<p className="text-label-subtle font-medium">
							{formatDotFullDate(billDetail.createdAt)}
						</p>
					</div>
					<div className="flex gap-4 text-body2">
						<p className="w-17.5 font-semibold text-label-assistive shrink-0">초대 범위</p>
						<div className="flex gap-1 flex-wrap">
							{billDetail.inviteAuthorities.map((inviteAuthority, index) => {
								return (
									<div
										key={`invite-authority-${inviteAuthority.invitedAuthorityId}-${index}`}
										className="bg-gray-100 px-[5px] py-[3px] rounded-sm text-caption1 font-semibold text-gray-500"
									>
										@{inviteAuthority.authorityName}
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>

			<div className="p-4">
				<div className="py-3 px-5 rounded-[10px] bg-primary-extralight flex flex-col gap-y-3">
					<div className="flex items-center justify-between">
						<p className="text-body2 font-semibold text-label-subtle">복사해서 편하게 송금하기</p>
						<CopyButton value="dfdf" onCopy={() => toast.success('송금 정보를 복사했어요.')} />
					</div>
					<Divider className="h-px bg-blue-100" />
					<div>
						<p className="text-caption1 font-semibold text-label-assistive mb-1.5">내가 낼 금액</p>
						<p className="text-headline1 font-bold text-primary-normal">100,000원</p>
					</div>
					<div>
						<p className="text-caption1 font-semibold text-label-assistive mb-1.5">송금할 계좌</p>
						<p className="text-body1 font-semibold text-label-subtle">
							1001 9271 5621 토스뱅크 장다혜
						</p>
					</div>
				</div>
			</div>

			<Divider className="h-2 my-2" />

			<p className="text-title2 font-semibold text-label-strong px-4 py-2">회식 참석 현황</p>
			{billDetail.gatherings.map((gathering) => {
				return <></>;
			})}
		</>
	);
};

export { BillInProgressDetail };

function BillDetailHeader() {
	return (
		<div className="flex py-3 px-4 rounded-lg bg-background-subtle items-center">
			<div className="flex flex-col items-center gap-1.5 px-4">
				<svg
					width="32"
					height="32"
					viewBox="0 0 32 32"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>정산중</title>
					<rect width="32" height="32" rx="16" fill="#5E83FE" />
					<circle cx="9.5" cy="16.5" r="1.5" fill="white" />
					<circle cx="16.5" cy="16.5" r="1.5" fill="white" />
					<circle cx="23.5" cy="16.5" r="1.5" fill="white" />
				</svg>

				<p className="text-caption1 font-semibold text-primary-normal">정산중</p>
			</div>
			<div className="h-9 bg-line-normal w-px mx-5" />
			<p className="text-body2 font-medium text-label-subtle">
				송금하실 금액과 계좌를 확인 후 입금해 주세요.
			</p>
		</div>
	);
}
