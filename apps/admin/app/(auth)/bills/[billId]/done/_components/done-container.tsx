'use client';

import { Button, toast } from '@dpm-core/shared';
import { CopyToClipBoard } from '../../../create/[billId]/_components/copy-to-clipboard';

interface DoneContainerProps {
	billId: number;
}

export const DoneContainer = (props: DoneContainerProps) => {
	const { billId } = props;
	const billLink = `${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/bills/${billId}`;

	return (
		<div className="flex-1 flex items-center justify-center">
			<div className="flex items-center justify-center flex-col gap-8">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="33"
					height="32"
					viewBox="0 0 33 32"
					fill="none"
				>
					<title>icon</title>
					<path
						d="M16.5 0C25.3366 0.000131946 32.5 7.16339 32.5 16C32.4999 24.8365 25.3365 31.9999 16.5 32C7.66339 32 0.500132 24.8366 0.5 16C0.5 7.16331 7.66331 0 16.5 0ZM22.5615 11.9385C21.9757 11.3527 21.0262 11.3527 20.4404 11.9385L14.501 17.8779L12.5615 15.9385C11.9757 15.3527 11.0262 15.3527 10.4404 15.9385C9.85463 16.5243 9.85463 17.4738 10.4404 18.0596L13.4404 21.0596C14.0262 21.6451 14.9758 21.6453 15.5615 21.0596L22.5615 14.0596C23.1472 13.4739 23.1471 12.5243 22.5615 11.9385Z"
						fill="#5E83FE"
					/>
				</svg>
				<div className="flex flex-col items-center gap-[22px]">
					<div className="flex flex-col gap-4  text-center">
						<h1 className="text-title1 font-bold text-[#1A1C1E]">최종 정산 링크 생성됨</h1>
						<p className="text-label-assistive text-body2 font-medium">
							최종 링크를 복사해 공유하면,
							<br />
							멤버들이 각자 입금 금액을 바로 확인할 수 있어요.
						</p>
					</div>

					<CopyToClipBoard
						text={billLink}
						onCopy={() => toast.success('최종 정산 링크를 복사했습니다.')}
					>
						<Button size="md" variant="none" className="bg-background-strong">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="15"
								height="8"
								viewBox="0 0 15 8"
								fill="none"
							>
								<title>icon</title>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M4.16673 1.2673C3.44181 1.2673 2.74657 1.55525 2.23397 2.06782C1.72137 2.58038 1.4334 3.27557 1.4334 4.00044C1.4334 4.72532 1.72137 5.4205 2.23397 5.93307C2.74657 6.44563 3.44181 6.73359 4.16673 6.73359H5.50006C5.83144 6.73359 6.10006 7.0022 6.10006 7.33355C6.10006 7.66489 5.83144 7.9335 5.50006 7.9335H4.16673C3.12355 7.9335 2.12309 7.51913 1.38544 6.78154C0.647802 6.04395 0.233398 5.04356 0.233398 4.00044C0.233398 2.95733 0.647802 1.95694 1.38544 1.21935C2.12309 0.481758 3.12355 0.0673828 4.16673 0.0673828H5.50006C5.83144 0.0673828 6.10006 0.335993 6.10006 0.667341C6.10006 0.998689 5.83144 1.2673 5.50006 1.2673H4.16673Z"
									fill="#9CA3AF"
								/>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M8.90002 0.667341C8.90002 0.335993 9.16865 0.0673828 9.50002 0.0673828H10.8334C11.8765 0.0673828 12.877 0.481758 13.6146 1.21935C14.3523 1.95694 14.7667 2.95733 14.7667 4.00044C14.7667 5.04356 14.3523 6.04395 13.6146 6.78154C12.877 7.51913 11.8765 7.9335 10.8334 7.9335H9.50002C9.16865 7.9335 8.90002 7.66489 8.90002 7.33355C8.90002 7.0022 9.16865 6.73359 9.50002 6.73359H10.8334C11.5583 6.73359 12.2535 6.44563 12.7661 5.93307C13.2787 5.4205 13.5667 4.72532 13.5667 4.00044C13.5667 3.27557 13.2787 2.58038 12.7661 2.06782C12.2535 1.55525 11.5583 1.2673 10.8334 1.2673H9.50002C9.16865 1.2673 8.90002 0.998689 8.90002 0.667341Z"
									fill="#9CA3AF"
								/>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M4.2334 4.00035C4.2334 3.669 4.50203 3.40039 4.8334 3.40039H10.1667C10.4981 3.40039 10.7667 3.669 10.7667 4.00035C10.7667 4.3317 10.4981 4.60031 10.1667 4.60031H4.8334C4.50203 4.60031 4.2334 4.3317 4.2334 4.00035Z"
									fill="#9CA3AF"
								/>
							</svg>
							<span>최종 정산 링크 복사</span>
						</Button>
					</CopyToClipBoard>
				</div>
			</div>
		</div>
	);
};
