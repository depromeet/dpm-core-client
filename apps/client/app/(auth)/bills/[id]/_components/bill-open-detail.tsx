import Link from 'next/link';
import { useId } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { type Control, useForm } from 'react-hook-form';
import z from 'zod';
import { type Bill, bill } from '@dpm-core/api';
import {
	Button,
	CheckBlue,
	Divider,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	Form,
	FormField,
	formatDotFullDate,
	useAppShell,
	XIcon,
	XRed,
} from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';

import { BillDetailSubmitButton } from './bill-detail-submit-button';

const afterPartyStatusSchema = z.object({
	afterPartyJoins: z.array(
		z.object({
			gatheringId: z.number(),
			isJoined: z.boolean(),
		}),
	),
});

const BillOpenDetail = ({ billDetail }: { billDetail: Bill }) => {
	const { ref } = useAppShell();
	const formId = useId();
	const form = useForm({
		resolver: zodResolver(afterPartyStatusSchema),
		defaultValues: {
			afterPartyJoins: billDetail.gatherings.map((afterParty) => ({
				gatheringId: afterParty.gatheringId,
				isJoined: false,
			})),
		},
	});

	const { mutate, isPending } = useMutation({
		mutationFn: (data: z.infer<typeof afterPartyStatusSchema>) => {
			//TODO: 정합성 ok?
			return Promise.all([
				bill.patchBillAfterPartyJoins(billDetail.billId, data.afterPartyJoins),
				bill.patchBillParticipationConfirm(billDetail.billId),
			]);
		},
		onError(error: Error) {
			//TODO: 에러 처리
			console.log(error.message);
		},
	});

	const handleSubmit = (data: z.infer<typeof afterPartyStatusSchema>) => {
		mutate(data);
	};

	return (
		<>
			<AppHeader
				title="회식 참석 조사"
				className="mb-1.5"
				leftIcon={false}
				rightIcon={
					<Link href="/bills" className="absolute right-4 text-icon-noraml">
						<XIcon />
					</Link>
				}
			/>
			<div className="mx-4 rounded-lg bg-red-50 px-4 py-3 font-medium text-caption1 text-red-500">
				모든 인원이 투표를 완료해야 정산이 원할하게 진행됩니다.
				<br /> 반드시 참석 여부를 선택해 주세요.
			</div>

			<div className="flex flex-col gap-y-5 p-4">
				<h3 className="font-bold text-headline2 text-label-normal">{billDetail.title}</h3>
				{billDetail.description ? (
					<p className="font-medium text-body2 text-label-assistive">{billDetail.description}</p>
				) : null}
				<div className="flex gap-4 text-body2">
					<p className="w-17.5 shrink-0 font-semibold text-label-assistive">회식 날짜</p>
					<p className="font-medium text-label-subtle">{formatDotFullDate(billDetail.createdAt)}</p>
				</div>
				<div className="flex gap-4 text-body2">
					<p className="w-17.5 shrink-0 font-semibold text-label-assistive">초대 범위</p>
					<div className="flex flex-wrap gap-1">
						{billDetail.inviteAuthorities.map((inviteAuthority, index) => {
							return (
								<div
									key={`invite-authority-${inviteAuthority.invitedAuthorityId}-${index}`}
									className="rounded-sm bg-gray-100 px-[5px] py-[3px] font-semibold text-caption1 text-gray-500"
								>
									@{inviteAuthority.authorityName}
								</div>
							);
						})}
					</div>
				</div>
			</div>

			<Divider className="my-2 h-2" />

			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} id={formId}>
					{billDetail.gatherings.map((afterParty, afterPartyIndex) => {
						return (
							<AfterPartyRoundDetail
								key={afterParty.gatheringId}
								title={afterParty.title}
								afterPartyIndex={afterPartyIndex}
								control={form.control}
							/>
						);
					})}
				</form>
			</Form>

			<Drawer dismissible={!isPending}>
				<DrawerTrigger asChild>
					<BillDetailSubmitButton />
				</DrawerTrigger>
				<DrawerContent
					className="mx-auto"
					style={{
						// FIXME: 바텀시트 위치 계산식 분리
						maxWidth: ref.current?.clientWidth ?? 'auto',
					}}
				>
					<DrawerTitle className="sr-only">제출 전 확인</DrawerTitle>
					<DrawerDescription className="sr-only">
						- 참석 여부는 모든 디퍼에게 공개됩니다.
						<br />- 멤버 확정 후에는 수정이 불가능하니, 제출 전 한번 더 확인해 주세요.
					</DrawerDescription>
					<DrawerHeader className="items-start gap-y-2! px-5 pt-[30px] text-left!">
						<h3 className="font-semibold text-label-normal text-title2">제출 전 확인</h3>
					</DrawerHeader>
					<div className="mt-3 flex flex-col gap-y-2 px-5">
						<p className="font-semibold text-body1 text-label-subtle">{billDetail.title}</p>
						<div className="flex flex-col gap-y-3 rounded-lg bg-background-subtle px-5 py-3">
							<FormField
								control={form.control}
								name="afterPartyJoins"
								render={({ field }) => {
									return (
										<>
											{field.value.map((joinItem) => {
												const afterParty = billDetail.gatherings.find(
													(ap) => ap.gatheringId === joinItem.gatheringId,
												);
												if (!afterParty) return null;
												return (
													<div className="flex gap-4 text-body2" key={joinItem.gatheringId}>
														<p className="w-17.5 shrink-0 font-semibold text-label-assistive">
															{afterParty.roundNumber}차
														</p>
														{/* FIXME */}
														{joinItem.isJoined ? (
															<div className="flex items-center gap-x-0.5">
																<CheckBlue />
																<p className="font-semibold text-label-subtle">참석함</p>
															</div>
														) : (
															<div className="flex items-center gap-x-0.5">
																<XRed />
																<p className="font-semibold text-label-subtle">참석 안함</p>
															</div>
														)}
													</div>
												);
											})}
										</>
									);
								}}
							/>
						</div>
					</div>
					<ul className="mt-5 px-5 font-medium text-body2 text-label-subtle">
						<li className="relative pl-2.5 before:absolute before:left-0 before:content-['-']">
							참석 여부는 모든 디퍼에게 공개됩니다.
						</li>
						<li className="relative pl-2.5 before:absolute before:left-0 before:content-['-']">
							멤버 확정 후에는 <strong className="font-medium text-red-500">수정이 불가능</strong>
							하니, 제출 전 한번 더 확인해 주세요.
						</li>
					</ul>

					<div className="mt-8 mb-5 flex gap-x-2 px-5">
						<DrawerClose disabled={isPending} asChild>
							<Button disabled={isPending} className="flex-1" size="lg" variant="assistive">
								수정하기
							</Button>
						</DrawerClose>
						<Button
							disabled={isPending}
							className="flex-1"
							size="lg"
							variant="secondary"
							form={formId}
							type="submit"
						>
							제출하기
						</Button>
					</div>
				</DrawerContent>
			</Drawer>
		</>
	);
};
function AfterPartyRoundDetail({
	title,
	afterPartyIndex,
	control,
}: {
	title: string;
	afterPartyIndex: number;
	control: Control<z.infer<typeof afterPartyStatusSchema>>;
}) {
	return (
		<div className="flex flex-col gap-y-3 px-4 py-8">
			<p className="font-semibold text-body1 text-label-subtle">{title}</p>
			<FormField
				control={control}
				name={`afterPartyJoins.${afterPartyIndex}.isJoined`}
				render={({ field }) => {
					return (
						<div
							className="flex overflow-hidden rounded-lg border border-line-normal"
							role="radiogroup"
							aria-labelledby={`after-party-title-${afterPartyIndex}`}
						>
							<label className="h-auto flex-1 cursor-pointer rounded-none bg-background-normal px-3 py-3.5 text-center font-medium text-body2 text-label-assistive duration-200 has-checked:bg-primary-extralight has-checked:font-semibold has-checked:text-primary-normal">
								<input
									type="radio"
									{...field}
									onChange={() => field.onChange(false)}
									value="false"
									checked={!field.value}
									className="sr-only"
								/>
								참석 안함
							</label>
							<label className="h-auto flex-1 cursor-pointer rounded-none bg-background-normal px-3 py-3.5 text-center font-medium text-body2 text-label-assistive duration-200 has-checked:bg-primary-extralight has-checked:font-semibold has-checked:text-primary-normal">
								<input
									type="radio"
									{...field}
									onChange={() => field.onChange(true)}
									value="true"
									checked={field.value}
									className="sr-only"
								/>
								참석함
							</label>
						</div>
					);
				}}
			/>
		</div>
	);
}

export { BillOpenDetail };
