'use client';

import { Button, useAppShell } from '@dpm-core/shared';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { createPortal } from 'react-dom';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { getBillsQueryOptions } from '@/remotes/queries/bill';
import { useBillStatusSearchParams } from '../_hooks/use-bill-status-search-params';
import { BillFilter } from './bill-filter';
import { BillItem } from './bill-item';

const BillListContainer = () => {
	const { billStatus } = useBillStatusSearchParams();
	const {
		data: {
			data: { bills },
		},
	} = useSuspenseQuery(getBillsQueryOptions);

	const filteredBillsByStatus =
		billStatus === 'ALL' ? bills : bills.filter((bill) => bill.billStatus === billStatus);

	return (
		<>
			<BillFilter />
			{filteredBillsByStatus.length > 0 ? (
				<ul className="flex flex-col gap-y-2">
					{filteredBillsByStatus.map((bill) => {
						return <BillItem key={bill.billId} bill={bill} />;
					})}
				</ul>
			) : (
				<div className="flex flex-col flex-1 justify-center items-center">
					<svg
						width="57"
						height="56"
						viewBox="0 0 57 56"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>bill-01</title>
						<path
							d="M34.0469 10.1569C34.4621 9.94925 34.9509 9.94929 35.3662 10.1569L38.0781 11.5124L40.791 10.1569C41.2482 9.92842 41.7908 9.95275 42.2256 10.2213C42.6605 10.4901 42.9258 10.965 42.9258 11.4762V45.195C42.9257 45.7061 42.6604 46.1811 42.2256 46.4499C41.7909 46.7184 41.2481 46.7427 40.791 46.5143L38.0781 45.1569L35.3662 46.5143C34.951 46.7219 34.4621 46.7219 34.0469 46.5143L31.334 45.1569L28.623 46.5143C28.2079 46.7219 27.7189 46.7217 27.3037 46.5143L24.5908 45.1569L21.8789 46.5143C21.4637 46.7219 20.9748 46.7219 20.5596 46.5143L17.8467 45.1569L15.1357 46.5143C14.6785 46.7429 14.1351 46.7185 13.7002 46.4499C13.2654 46.1811 13.0001 45.7061 13 45.195V11.4762C13 10.965 13.2653 10.4901 13.7002 10.2213C14.1351 9.95263 14.6785 9.92827 15.1357 10.1569L17.8467 11.5124L20.5596 10.1569L20.7188 10.0885C21.0961 9.95238 21.5156 9.97526 21.8789 10.1569L24.5908 11.5124L27.3037 10.1569L27.4619 10.0885C27.8394 9.95219 28.2596 9.97517 28.623 10.1569L31.334 11.5124L34.0469 10.1569ZM21.2168 33.6139C20.4021 33.6139 19.7412 34.2748 19.7412 35.0895C19.7412 35.9042 20.4021 36.5651 21.2168 36.5651H29.6465L29.7969 36.5573C30.5409 36.4819 31.1221 35.8534 31.1221 35.0895C31.1221 34.3256 30.5409 33.6971 29.7969 33.6217L29.6465 33.6139H21.2168ZM21.2168 26.8698C20.4021 26.8698 19.7412 27.5306 19.7412 28.3454C19.7412 29.1601 20.4021 29.821 21.2168 29.821H34.7041L34.8555 29.8131C35.5991 29.7374 36.1797 29.109 36.1797 28.3454C36.1797 27.5817 35.5991 26.9533 34.8555 26.8776L34.7041 26.8698H21.2168ZM21.2168 20.1178C20.4021 20.1178 19.7412 20.7787 19.7412 21.5934C19.7412 22.4081 20.4021 23.069 21.2168 23.069H31.332L31.4834 23.0612C32.2272 22.9855 32.8076 22.3571 32.8076 21.5934C32.8076 20.8297 32.2272 20.2013 31.4834 20.1256L31.332 20.1178H21.2168Z"
							fill="#E5E7EB"
						/>
					</svg>

					<p className="text-body1 font-semibold text-label-assistive">아직 정산서가 없어요.</p>
				</div>
			)}
			<AddButton />
		</>
	);
};

const BillLsit = ErrorBoundary.with(
	{
		fallback: (props) => <ErrorBox onReset={() => props.reset()} />,
	},
	() => (
		<Suspense fallback={<LoadingBox />}>
			<BillListContainer />
		</Suspense>
	),
);

export { BillLsit };

function AddButton() {
	const { ref } = useAppShell();

	const router = useRouter();
	const handleCreateSettle = () => {
		router.push('/bills/create');
	};
	return createPortal(
		<Button
			variant="none"
			className="absolute py-3.5 px-4 right-5 bottom-5 text-label-inverse bg-gray-800 drop-shadow-[0_0_12px_rgba(0,0,0,0.06)] rounded-full"
			onClick={handleCreateSettle}
		>
			<svg
				width="20"
				height="20"
				viewBox="0 0 20 20"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				aria-label="plus"
			>
				<title>plus</title>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M3.41699 10.0049C3.41699 9.59067 3.75278 9.25488 4.16699 9.25488L15.8337 9.25488C16.2479 9.25488 16.5837 9.59067 16.5837 10.0049C16.5837 10.4191 16.2479 10.7549 15.8337 10.7549L4.16699 10.7549C3.75278 10.7549 3.41699 10.4191 3.41699 10.0049Z"
					fill="white"
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M10 3.42188C10.4142 3.42188 10.75 3.75766 10.75 4.17187L10.75 15.8385C10.75 16.2528 10.4142 16.5885 10 16.5885C9.58579 16.5885 9.25 16.2528 9.25 15.8385L9.25 4.17187C9.25 3.75766 9.58579 3.42188 10 3.42188Z"
					fill="white"
				/>
			</svg>
			추가
		</Button>,
		ref.current,
	);
}
