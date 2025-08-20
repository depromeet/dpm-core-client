'use client';

import { type Bill, bill, isHttpError } from '@dpm-core/api';
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
	toast,
	useAppShell,
	XIcon,
	XRed,
} from '@dpm-core/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useId } from 'react';
import { type Control, useForm } from 'react-hook-form';
import z from 'zod';
import { AppHeader } from '@/components/app-header';
import { BillDetailSubmitButton } from './bill-detail-submit-button';

const gatheringStatusSchema = z.object({
	gatheringJoins: z.array(
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
		resolver: zodResolver(gatheringStatusSchema),
		defaultValues: {
			gatheringJoins: billDetail.gatherings.map((gathering) => ({
				gatheringId: gathering.gatheringId,
				isJoined: false,
			})),
		},
	});

	const { mutate, isPending } = useMutation({
		mutationFn: async (data: z.infer<typeof gatheringStatusSchema>) => {
			//TODO: 정합성 ok?
			await bill.patchBillGatheringJoins(billDetail.billId, data.gatheringJoins);
			await bill.patchBillParticipationConfirm(billDetail.billId);
			return true;
		},
		async onError(error) {
			let message = '회식 참석 조사 제출에 실패했어요.';
			if (isHttpError(error)) {
				const res = await error.response.json<{ message: string }>();
				message = res.message;
			}
			toast.error(message);
		},
	});

	const handleSubmit = (data: z.infer<typeof gatheringStatusSchema>) => {
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
			<div className="mx-4 py-3 px-4 bg-red-50 text-caption1 font-medium text-red-500 rounded-lg">
				모든 인원이 투표를 완료해야 정산이 원할하게 진행됩니다.
				<br /> 반드시 참석 여부를 선택해 주세요.
			</div>

			<div className="flex flex-col p-4 gap-y-5">
				<h3 className="text-headline2 font-bold text-label-normal">{billDetail.title}</h3>
				{billDetail.description ? (
					<p className="text-body2 text-label-assistive font-medium">{billDetail.description}</p>
				) : null}
				<div className="flex gap-4 text-body2">
					<p className="w-17.5 font-semibold text-label-assistive shrink-0">회식 날짜</p>
					<p className="text-label-subtle font-medium">{formatDotFullDate(billDetail.createdAt)}</p>
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

			<Divider className="h-2 my-2" />

			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} id={formId}>
					{billDetail.gatherings.map((gathering, gatheringIndex) => {
						return (
							<GatheringDetail
								key={gathering.gatheringId}
								title={gathering.title}
								gatheringIndex={gatheringIndex}
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
					<DrawerHeader className="!text-left !gap-y-2 items-start px-5 pt-[30px]">
						<h3 className="text-title2 font-semibold text-label-normal">제출 전 확인</h3>
					</DrawerHeader>
					<div className="mt-3 flex flex-col gap-y-2 px-5">
						<p className="text-body1 font-semibold text-label-subtle">{billDetail.title}</p>
						<div className="flex flex-col gap-y-3 py-3 px-5 bg-background-subtle rounded-lg">
							<FormField
								control={form.control}
								name="gatheringJoins"
								render={({ field }) => {
									return (
										<>
											{field.value.map((gatheringJoin) => {
												const gathering = billDetail.gatherings.find(
													(gathering) => gathering.gatheringId === gatheringJoin.gatheringId,
												);
												if (!gathering) return null;
												return (
													<div className="flex gap-4 text-body2" key={gatheringJoin.gatheringId}>
														<p className="w-17.5 font-semibold text-label-assistive shrink-0">
															{gathering.roundNumber}차
														</p>
														{/* FIXME */}
														{gatheringJoin.isJoined ? (
															<div className="flex items-center gap-x-0.5">
																<CheckBlue />
																<p className="text-label-subtle font-semibold">참석함</p>
															</div>
														) : (
															<div className="flex items-center gap-x-0.5">
																<XRed />
																<p className="text-label-subtle font-semibold">참석 안함</p>
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
					<ul className="mt-5 px-5 text-body2 font-medium text-label-subtle">
						<li className="before:content-['-'] before:absolute before:left-0 pl-2.5 relative">
							참석 여부는 모든 디퍼에게 공개됩니다.
						</li>
						<li className="before:content-['-'] before:absolute before:left-0 pl-2.5 relative">
							멤버 확정 후에는 <strong className="font-medium text-red-500">수정이 불가능</strong>
							하니, 제출 전 한번 더 확인해 주세요.
						</li>
					</ul>

					<div className="flex gap-x-2 px-5 mt-8 mb-5">
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
function GatheringDetail({
	title,
	gatheringIndex,
	control,
}: {
	title: string;
	gatheringIndex: number;
	control: Control<z.infer<typeof gatheringStatusSchema>>;
}) {
	return (
		<div className="py-8 px-4 flex flex-col gap-y-3">
			<p className="text-body1 font-semibold text-label-subtle">{title}</p>
			<FormField
				control={control}
				name={`gatheringJoins.${gatheringIndex}.isJoined`}
				render={({ field }) => {
					return (
						<div
							className="flex rounded-lg border-line-normal border overflow-hidden"
							role="radiogroup"
							aria-labelledby={`gathering-title-${gatheringIndex}`}
						>
							<label className="flex-1 h-auto duration-200 py-3.5 px-3 text-body2 bg-background-normal font-medium text-label-assistive has-[:checked]:font-semibold rounded-none has-[:checked]:bg-primary-extralight has-[:checked]:text-primary-normal cursor-pointer text-center">
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
							<label className="flex-1 h-auto duration-200 py-3.5 px-3 text-body2 bg-background-normal font-medium text-label-assistive has-[:checked]:font-semibold rounded-none has-[:checked]:bg-primary-extralight has-[:checked]:text-primary-normal cursor-pointer text-center">
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
