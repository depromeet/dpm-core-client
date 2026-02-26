'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	Button,
	CheckBlue,
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	ToggleGroup,
	ToggleGroupItem,
	toast,
	XRed,
} from '@dpm-core/shared';

import { submitAttendanceStatusMutationOptions } from '@/remotes/mutations/after-party';
import { getAfterPartyDetailQueryOptions } from '@/remotes/queries/after-party';

interface AfterPartyRsvpProps {
	title: string;
	rsvpStatus: boolean | null;
	gatheringId: number;
}

export const AfterPartyRsvp = (props: AfterPartyRsvpProps) => {
	const { title, rsvpStatus: rsvpStatusProp, gatheringId } = props;

	const queryClient = useQueryClient();
	const { mutate: submitRsvpStatus, isPending: isSubmitRsvpStatusPending } = useMutation(
		submitAttendanceStatusMutationOptions(gatheringId),
	);

	const [rsvpStatus, setRsvpStatus] = useState(() =>
		rsvpStatusProp === null ? undefined : rsvpStatusProp ? '참석' : '불참',
	);

	const isNotSubmitted = rsvpStatusProp === null;

	const handleChangeRsvpStatus = (value: '참석' | '불참') => {
		setRsvpStatus(value);
	};

	const handleSumbitRsvpStatus = () => {
		if (!rsvpStatus) return;
		const isRsvpGoing = rsvpStatus === '참석';
		submitRsvpStatus(
			{ isRsvpGoing },
			{
				onSuccess: () => {
					queryClient.invalidateQueries(getAfterPartyDetailQueryOptions(gatheringId));
					toast.success('저장했어요');
				},
				onError: () => {
					toast.error('저장에 실패했어요');
				},
			},
		);
	};

	const handleModifyRsvpStatus = () => {
		if (!rsvpStatus) return;
		const isRsvpGoing = rsvpStatus === '참석';
		submitRsvpStatus(
			{ isRsvpGoing },
			{
				onSuccess: () => {
					queryClient.invalidateQueries(getAfterPartyDetailQueryOptions(gatheringId));
					toast.success('수정 완료했어요');
				},
				onError: () => {
					toast.error('수정에 실패했어요');
				},
			},
		);
	};

	return (
		<section className="px-4 pt-5 pb-8">
			<div className="flex flex-col">
				<div className="flex items-center justify-between">
					<h3 className="font-semibold text-body1 text-label-subtle">회식 참여 여부</h3>
					{!isNotSubmitted && (
						<Drawer>
							<DrawerTrigger asChild>
								<Button size="md" variant="text" className="h-10 px-4">
									수정하기
								</Button>
							</DrawerTrigger>
							<DrawerContent className="mx-auto max-w-lg">
								<DrawerHeader className="mb-3 px-5 pt-5">
									<DrawerTitle>수정하기</DrawerTitle>
								</DrawerHeader>
								<section className="px-5 pb-3">
									<p className="mb-2 font-semibold text-body2 text-label-subtle">회식 참여 여부</p>
									<ToggleGroup
										size="xl"
										type="single"
										className="w-full rounded-lg border border-gray-300"
										value={rsvpStatus}
										onValueChange={handleChangeRsvpStatus}
									>
										<ToggleGroupItem
											className="not-last:border-gray-300 not-last:border-r font-medium text-label-assistive transition-colors data-[state=on]:bg-primary-extralight data-[state=on]:font-semibold data-[state=on]:text-primary-normal"
											value="불참"
										>
											불참
										</ToggleGroupItem>
										<ToggleGroupItem
											className="not-last:border-gray-300 not-last:border-r font-medium text-label-assistive transition-colors data-[state=on]:bg-primary-extralight data-[state=on]:font-semibold data-[state=on]:text-primary-normal"
											value="참석"
										>
											참석
										</ToggleGroupItem>
									</ToggleGroup>
								</section>
								<DrawerFooter className="flex-row px-5 pt-3 pb-5">
									<Button
										variant="secondary"
										size="lg"
										className="flex-1"
										onClick={handleModifyRsvpStatus}
										disabled={isSubmitRsvpStatusPending}
									>
										수정하기
									</Button>
								</DrawerFooter>
							</DrawerContent>
						</Drawer>
					)}
				</div>
				{isNotSubmitted && (
					<ToggleGroup
						size="xl"
						type="single"
						className="mt-2 w-full rounded-lg border border-gray-300"
						value={rsvpStatus}
						onValueChange={handleChangeRsvpStatus}
					>
						<ToggleGroupItem
							className="not-last:border-gray-300 not-last:border-r font-medium text-label-assistive transition-colors data-[state=on]:bg-primary-extralight data-[state=on]:font-semibold data-[state=on]:text-primary-normal"
							value="불참"
						>
							불참
						</ToggleGroupItem>
						<ToggleGroupItem
							className="not-last:border-gray-300 not-last:border-r font-medium text-label-assistive transition-colors data-[state=on]:bg-primary-extralight data-[state=on]:font-semibold data-[state=on]:text-primary-normal"
							value="참석"
						>
							참석
						</ToggleGroupItem>
					</ToggleGroup>
				)}
				{isNotSubmitted && (
					<Drawer>
						<DrawerTrigger asChild>
							<Button
								variant="secondary"
								size="md"
								className="mt-3 w-full"
								disabled={rsvpStatus === undefined || isSubmitRsvpStatusPending}
							>
								제출하기
							</Button>
						</DrawerTrigger>
						<DrawerContent className="mx-auto max-w-lg">
							<DrawerHeader className="mb-3 px-5 pt-5">
								<DrawerTitle>참석 여부 제출전 확인</DrawerTitle>
							</DrawerHeader>
							<section className="px-5 pb-3">
								<p className="mb-2 font-semibold text-body1 text-label-subtle">{title}</p>
								<div className="mb-3 flex gap-3 rounded-lg bg-background-strong px-5 py-3 font-semibold text-body2">
									<p className="w-17.5 text-label-assistive">회식</p>
									{rsvpStatus === '참석' && (
										<div className="flex items-center gap-0.5">
											<CheckBlue />
											<span className="text-label-subtle">참석</span>
										</div>
									)}
									{rsvpStatus === '불참' && (
										<div className="flex items-center gap-x-0.5">
											<XRed />
											<p className="text-label-subtle">불참</p>
										</div>
									)}
								</div>
								<p className="font-medium text-body2 text-label-subtle">
									참석 여부는 모든 디퍼에게 공개돼요.
									<br />
									원활한 회식 진행을 위해, 제출 전 한 번 더 확인해 주세요.
								</p>
							</section>
							<DrawerFooter className="flex-row px-5 pt-3 pb-5">
								<Button
									variant="secondary"
									size="lg"
									className="flex-1"
									onClick={handleSumbitRsvpStatus}
									disabled={isSubmitRsvpStatusPending}
								>
									제출하기
								</Button>
							</DrawerFooter>
						</DrawerContent>
					</Drawer>
				)}
				{!isNotSubmitted && rsvpStatus === '참석' && (
					<div className="mt-3 flex items-center gap-0.5 rounded-lg bg-background-subtle px-5 py-3">
						<CheckBlue />
						<span className="font-semibold text-body2 text-label-subtle">참석</span>
					</div>
				)}
				{!isNotSubmitted && rsvpStatus === '불참' && (
					<div className="mt-3 flex items-center gap-x-0.5 rounded-lg bg-background-subtle px-5 py-3">
						<XRed />
						<p className="font-semibold text-body2 text-label-subtle">불참</p>
					</div>
				)}
			</div>
		</section>
	);
};
