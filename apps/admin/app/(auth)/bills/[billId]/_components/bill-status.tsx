'use client';

import type { BillStatus } from '@dpm-core/api';
import { Button, toast } from '@dpm-core/shared';
import { CopyToClipBoard } from '../../create/[billId]/_components/copy-to-clipboard';

interface Props {
	billStatus: BillStatus;
}

export const BillStatusInformation = ({ billStatus }: Props) => {
	return (
		<div className="flex flex-col gap-2.5">
			<div className="px-4 py-3 flex items-center gap-5 bg-background-subtle rounded-lg">
				<BillStatusBadge billStatus={billStatus} />
				<div className="w-px bg-line-normal h-9 flex items-center" />
				<p className="text-label-subtle text-body2 font-medium">
					<BillStatusDescription billStatus={billStatus} />
				</p>
			</div>
			{billStatus === 'IN_PROGRESS' && (
				<CopyToClipBoard text="" onCopy={() => toast.success('최종 정산 링크를 복사했습니다.')}>
					<Button variant="none" className="bg-background-strong">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="8"
							viewBox="0 0 16 8"
							fill="none"
						>
							<title>icon</title>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M4.66673 1.26828C3.94181 1.26828 3.24657 1.55623 2.73397 2.0688C2.22137 2.58136 1.9334 3.27655 1.9334 4.00142C1.9334 4.7263 2.22137 5.42148 2.73397 5.93404C3.24657 6.44661 3.94181 6.73456 4.66673 6.73456H6.00006C6.33144 6.73456 6.60006 7.00317 6.60006 7.33452C6.60006 7.66587 6.33144 7.93448 6.00006 7.93448H4.66673C3.62355 7.93448 2.62309 7.52011 1.88545 6.78251C1.1478 6.04492 0.733398 5.04453 0.733398 4.00142C0.733398 2.95831 1.1478 1.95792 1.88545 1.22033C2.62309 0.482734 3.62355 0.0683594 4.66673 0.0683594H6.00006C6.33144 0.0683594 6.60006 0.33697 6.60006 0.668318C6.60006 0.999666 6.33144 1.26828 6.00006 1.26828H4.66673Z"
								fill="#9CA3AF"
							/>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M9.3999 0.668318C9.3999 0.33697 9.66853 0.0683594 9.9999 0.0683594H11.3332C12.3764 0.0683594 13.3769 0.482734 14.1145 1.22033C14.8522 1.95792 15.2666 2.95831 15.2666 4.00142C15.2666 5.04453 14.8522 6.04492 14.1145 6.78251C13.3769 7.52011 12.3764 7.93448 11.3332 7.93448H9.9999C9.66853 7.93448 9.3999 7.66587 9.3999 7.33452C9.3999 7.00317 9.66853 6.73456 9.9999 6.73456H11.3332C12.0582 6.73456 12.7534 6.44661 13.266 5.93404C13.7786 5.42148 14.0666 4.7263 14.0666 4.00142C14.0666 3.27655 13.7786 2.58136 13.266 2.0688C12.7534 1.55623 12.0582 1.26828 11.3332 1.26828H9.9999C9.66853 1.26828 9.3999 0.999666 9.3999 0.668318Z"
								fill="#9CA3AF"
							/>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M4.7334 4.00133C4.7334 3.66998 5.00203 3.40137 5.3334 3.40137H10.6667C10.9981 3.40137 11.2667 3.66998 11.2667 4.00133C11.2667 4.33267 10.9981 4.60128 10.6667 4.60128H5.3334C5.00203 4.60128 4.7334 4.33267 4.7334 4.00133Z"
								fill="#9CA3AF"
							/>
						</svg>
						최종 정산 링크 복사
					</Button>
				</CopyToClipBoard>
			)}
		</div>
	);
};

const BillStatusBadge = ({ billStatus }: { billStatus: BillStatus }) => {
	return (
		<div className="flex flex-col gap-y-1.5 items-center">
			{(() => {
				switch (billStatus) {
					case 'OPEN':
						return (
							<>
								<svg
									width="32"
									height="32"
									viewBox="0 0 32 32"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									aria-label="멤버 확정 전"
								>
									<title>멤버 확정 전</title>
									<rect width="32" height="32" rx="16" fill="#E5E7EB" />
									<path
										d="M15.7874 15.7857C17.3851 15.7857 18.6802 14.4905 18.6802 12.8929C18.6802 11.2952 17.3851 10 15.7874 10C14.1897 10 12.8945 11.2952 12.8945 12.8929C12.8945 14.4905 14.1897 15.7857 15.7874 15.7857Z"
										fill="#9CA3AF"
									/>
									<path
										d="M22 21.4196C22 22.5915 21.25 23.001 16 23.001C10.75 23.001 10 22.5915 10 21.4196C10 20.2477 10.6321 19.1238 11.7574 18.2952C12.8826 17.4665 14.4087 17.001 16 17.001C17.5913 17.001 19.1174 17.4665 20.2426 18.2952C21.3679 19.1238 22 20.2477 22 21.4196Z"
										fill="#9CA3AF"
									/>
								</svg>
								<span className="text-caption1 font-semibold text-label-assistive">
									멤버 확정 전
								</span>
							</>
						);
					case 'IN_PROGRESS':
						return (
							<>
								<svg
									width="32"
									height="32"
									viewBox="0 0 32 32"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									aria-label="정산 중"
								>
									<title>정산 중</title>
									<rect width="32" height="32" rx="16" fill="#5E83FE" />
									<circle cx="9.5" cy="16.5" r="1.5" fill="white" />
									<circle cx="16.5" cy="16.5" r="1.5" fill="white" />
									<circle cx="23.5" cy="16.5" r="1.5" fill="white" />
								</svg>
								<span className="text-caption1 font-semibold text-primary-normal">정산 중</span>
							</>
						);
					case 'COMPLETED':
						return (
							<>
								<svg
									width="32"
									height="32"
									viewBox="0 0 32 32"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									aria-label="정산 끝"
								>
									<title>정산 끝</title>
									<rect width="32" height="32" rx="16" fill="#D1D5DB" />
									<path
										d="M21 12L13.5422 19L11 16.6139"
										stroke="white"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								<span className="text-caption1 font-semibold text-label-assistive">정산 끝</span>
							</>
						);
					default:
						billStatus satisfies never;
						return null;
				}
			})()}
		</div>
	);
};

const BillStatusDescription = ({ billStatus }: { billStatus: BillStatus }) => {
	return (
		<>
			{(() => {
				switch (billStatus) {
					case 'OPEN':
						return (
							<>
								초대 멤버 전원이 참석 여부를 제출하면
								<br />
								멤버를 확정할 수 있어요.
							</>
						);
					case 'IN_PROGRESS':
						return (
							<>
								1. 링크를 복사해 공유하면, 멤버들이 각자 입금 금액을 바로 확인할 수 있어요.
								<br />
								2. 모든 멤버의 입금을 확인하셨다면, 정산을 종료해 주세요.
							</>
						);
					case 'COMPLETED':
						return '정산이 종료된 회식입니다.';
					default:
						billStatus satisfies never;
						return null;
				}
			})()}
		</>
	);
};
