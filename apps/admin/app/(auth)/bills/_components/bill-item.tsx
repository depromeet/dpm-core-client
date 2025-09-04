import type { Bill, BillStatus } from '@dpm-core/api';
import Link from 'next/link';

function formatInvitationCount(
	invitedMemberCount: number,
	invitationSubmittedCount: number,
	billStatus: BillStatus,
) {
	switch (billStatus) {
		case 'OPEN':
			return `${invitationSubmittedCount}/${invitedMemberCount}명 제출`;
		case 'IN_PROGRESS':
		case 'COMPLETED':
			return `대상자 ${invitedMemberCount}명`;
	}
}

function BillItem({ bill }: { bill: Bill }) {
	return (
		<li>
			<Link
				href={`/bills/${bill.billId}`}
				className="flex items-center gap-x-6 p-4 flex-1 border-b border-b-line-subtle"
			>
				<BillStatusBadge status={bill.billStatus} />
				<div className="flex flex-col gap-y-2">
					<p className="text-body1 font-semibold text-label-normal">{bill.title}</p>
					<div className="flex flex-col">
						<div className="flex items-center py-1">
							<svg
								width="12"
								height="12"
								viewBox="0 0 12 12"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								aria-label="calendar-01"
								className="mr-1"
							>
								<title>calendar-01</title>
								<path
									d="M10.4658 8.91602C10.4658 9.81185 9.65499 10.4656 8.75 10.4658H3.25C2.34481 10.4658 1.53418 9.81201 1.53418 8.91602V4.91309H10.4658V8.91602ZM8.57812 1.53418C8.76634 1.53444 8.91895 1.68672 8.91895 1.875V2.42383C9.75333 2.49934 10.4656 3.12638 10.4658 3.96582V4.11621H1.53418V3.96582C1.53443 3.15955 2.19118 2.5504 2.98242 2.43652V1.875C2.98242 1.6867 3.13499 1.53441 3.32324 1.53418C3.51146 1.53444 3.66504 1.68672 3.66504 1.875V2.41602H8.2373V1.875C8.2373 1.68656 8.38968 1.53418 8.57812 1.53418Z"
									fill="#9CA3AF"
								/>
							</svg>
							<span className="text-caption1 font-medium text-label-assistive leading-tight">
								{bill.title}
							</span>
						</div>
						<div className="flex items-center py-1">
							<svg
								width="12"
								height="12"
								viewBox="0 0 12 12"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								aria-label="bill-01"
								className="mr-1"
							>
								<title>bill-01</title>
								<path
									d="M8.31348 0.795856C8.43807 0.73356 8.58537 0.73356 8.70996 0.795856L9.52246 1.20211L10.3369 0.795856C10.4741 0.727263 10.6371 0.734751 10.7676 0.815387C10.8979 0.896059 10.9775 1.03811 10.9775 1.19136V11.3066C10.9775 11.4599 10.898 11.6029 10.7676 11.6836C10.6372 11.7641 10.474 11.7716 10.3369 11.7031L9.52246 11.2959L8.70996 11.7031C8.58539 11.7653 8.43804 11.7654 8.31348 11.7031L7.5 11.2959L6.68652 11.7031C6.56212 11.7652 6.41544 11.7651 6.29102 11.7031L5.47656 11.2959L4.66309 11.7031C4.53865 11.7651 4.39198 11.7652 4.26758 11.7031L3.45312 11.2959L2.64062 11.7031C2.50356 11.7716 2.34036 11.764 2.20996 11.6836C2.07953 11.6029 2.00005 11.4599 2 11.3066V1.19136C2 1.03803 2.07956 0.896038 2.20996 0.815387C2.34043 0.734751 2.50344 0.727263 2.64062 0.795856L3.45312 1.20211L4.26758 0.795856L4.36426 0.7607C4.46393 0.737274 4.5696 0.749149 4.66309 0.795856L5.47656 1.20211L6.29102 0.795856L6.3877 0.7607C6.48732 0.73736 6.5931 0.749145 6.68652 0.795856L7.5 1.20211L8.31348 0.795856ZM4.46484 7.83199C4.22052 7.8321 4.02246 8.03003 4.02246 8.27437C4.02263 8.51858 4.22063 8.71664 4.46484 8.71675H6.99414L7.08301 8.70797C7.28454 8.66669 7.43638 8.48807 7.43652 8.27437C7.43652 8.06054 7.28463 7.88207 7.08301 7.84078L6.99414 7.83199H4.46484ZM4.46484 5.80757C4.22057 5.80769 4.02253 6.00567 4.02246 6.24996C4.02246 6.4943 4.22052 6.69223 4.46484 6.69234H8.51074C8.75516 6.69234 8.9541 6.49437 8.9541 6.24996C8.95403 6.0056 8.75511 5.80757 8.51074 5.80757H4.46484ZM4.46484 3.78414C4.22052 3.78425 4.02246 3.98217 4.02246 4.22652C4.02268 4.47068 4.22066 4.66879 4.46484 4.6689H7.49902C7.74331 4.6689 7.94216 4.47075 7.94238 4.22652C7.94238 3.9821 7.74344 3.78414 7.49902 3.78414H4.46484Z"
									fill="#9CA3AF"
								/>
							</svg>

							<span className="text-caption1 font-medium text-label-assistive">
								~{bill.gatherings.length}차
							</span>
							<div className="w-px h-2.5 bg-line-subtle mx-2" />
							<svg
								width="12"
								height="12"
								viewBox="0 0 12 12"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								aria-label="user-01"
								className="mr-1"
							>
								<title>user-01</title>
								<path
									d="M5.85818 4.85698C6.92325 4.85698 7.78666 3.99356 7.78666 2.92849C7.78666 1.86341 6.92325 1 5.85818 1C4.7931 1 3.92969 1.86341 3.92969 2.92849C3.92969 3.99356 4.7931 4.85698 5.85818 4.85698Z"
									fill="#9CA3AF"
									stroke="#9CA3AF"
									strokeWidth="0.857106"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M9.99965 9.94565C9.99965 10.7269 9.49967 10.9998 5.99983 10.9998C2.49998 10.9998 2 10.7269 2 9.94565C2 9.16442 2.42141 8.41518 3.17152 7.86276C3.92163 7.31034 4.93901 7 5.99983 7C7.06065 7 8.07802 7.31034 8.82813 7.86276C9.57824 8.41518 9.99965 9.16442 9.99965 9.94565Z"
									fill="#9CA3AF"
									stroke="#9CA3AF"
									strokeWidth="0.857106"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<span className="text-caption1 font-medium text-label-assistive">
								{formatInvitationCount(
									bill.invitedMemberCount,
									bill.invitationSubmittedCount,
									bill.billStatus,
								)}
							</span>
						</div>
					</div>
				</div>
			</Link>
		</li>
	);
}

function BillStatusBadge({ status }: { status: BillStatus }) {
	return (
		<div className="flex flex-col gap-y-1.5 items-center min-w-16">
			{(() => {
				switch (status) {
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
						status satisfies never;
						return null;
				}
			})()}
		</div>
	);
}

export { BillItem };
