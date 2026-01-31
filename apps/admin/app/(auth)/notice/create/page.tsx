'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
	AppLayout,
	Button,
	ChevronLeft,
	cn,
	Input,
	Label,
	Switch,
	Textarea,
	ToggleGroup,
	ToggleGroupItem,
} from '@dpm-core/shared';

import { Section } from '@/components/section';

export default function CreateNoticePage() {
	const [category, setCategory] = useState<string>('required');
	const [isScheduled, setIsScheduled] = useState(false);
	const [sendNotification, setSendNotification] = useState(false);

	return (
		<AppLayout className="bg-background-normal">
			{/* 상단 헤더 */}
			<header className="sticky top-0 z-10 border-line-normal border-b bg-background-normal">
				<div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-3 md:px-10 md:py-4">
					<Link href="/notice" className="flex items-center gap-2">
						<ChevronLeft className="text-icon-noraml" />
					</Link>
					<div className="flex items-center gap-2">
						<Button variant="assistive" size="sm">
							임시 0
						</Button>
						<Button variant="assistive" size="sm">
							임시저장
						</Button>
						<Button variant="secondary" size="sm">
							등록하기
						</Button>
					</div>
				</div>
			</header>

			<Section className="mx-auto w-full max-w-[800px] py-8">
				<div className="flex flex-col gap-8">
					{/* 카테고리 */}
					<div className="flex flex-col gap-2">
						<Label>카테고리</Label>
						<ToggleGroup
							type="single"
							value={category}
							onValueChange={(value) => {
								if (value) setCategory(value);
							}}
							className="flex gap-2"
						>
							<ToggleGroupItem
								value="required"
								className={cn(
									'rounded-[170px]! border border-line-normal bg-background-normal px-3 py-1 font-medium text-body2 text-label-assistive data-[state=on]:border-primary-normal data-[state=on]:text-primary-normal',
								)}
							>
								필수
							</ToggleGroupItem>
							<ToggleGroupItem
								value="assignment"
								className={cn(
									'rounded-[170px]! border border-line-normal bg-background-normal px-3 py-1 font-medium text-body2 text-label-assistive data-[state=on]:border-primary-normal data-[state=on]:text-primary-normal',
								)}
							>
								과제
							</ToggleGroupItem>
							<ToggleGroupItem
								value="other"
								className={cn(
									'rounded-[170px]! border border-line-normal bg-background-normal px-3 py-1 font-medium text-body2 text-label-assistive data-[state=on]:border-primary-normal data-[state=on]:text-primary-normal',
								)}
							>
								기타
							</ToggleGroupItem>
						</ToggleGroup>
					</div>

					{/* 공지 제목 */}
					<div className="flex flex-col gap-2">
						<Label>공지 제목</Label>
						<Input placeholder="ex. 디프만 00기 OT" variant="filled" />
					</div>

					{/* 상세 내용 */}
					<div className="flex flex-col gap-2">
						<Label>상세 내용</Label>
						{/* TODO: 리치 텍스트 에디터 툴바 추가 */}
						<div className="flex items-center gap-2 border-line-normal border-b pb-2">
							<button
								type="button"
								className="flex h-8 w-8 items-center justify-center rounded hover:bg-background-strong"
								aria-label="Bold"
							>
								<span className="font-bold text-body2">B</span>
							</button>
							<button
								type="button"
								className="flex h-8 w-8 items-center justify-center rounded hover:bg-background-strong"
								aria-label="Italic"
							>
								<span className="text-body2 italic">I</span>
							</button>
							<button
								type="button"
								className="flex h-8 w-8 items-center justify-center rounded hover:bg-background-strong"
								aria-label="Underline"
							>
								<span className="text-body2 underline">U</span>
							</button>
							<div className="mx-1 h-4 w-px bg-line-normal" />
							<button
								type="button"
								className="flex h-8 w-8 items-center justify-center rounded hover:bg-background-strong"
								aria-label="Link"
							>
								<span className="text-body2">🔗</span>
							</button>
							<div className="mx-1 h-4 w-px bg-line-normal" />
							<button
								type="button"
								className="flex h-8 w-8 items-center justify-center rounded hover:bg-background-strong"
								aria-label="Unordered List"
							>
								<span className="text-body2">•</span>
							</button>
							<button
								type="button"
								className="flex h-8 w-8 items-center justify-center rounded hover:bg-background-strong"
								aria-label="Ordered List"
							>
								<span className="text-body2">1.</span>
							</button>
						</div>
						<Textarea placeholder="ex. 디프만 00기 OT" variant="filled" className="min-h-[300px]" />
					</div>

					{/* 공지 예약하기 */}
					<div className="flex items-center justify-between">
						<Label>공지 예약하기</Label>
						<Switch checked={isScheduled} onCheckedChange={setIsScheduled} disabled />
					</div>

					{/* 등록알림 보내기 */}
					<div className="flex flex-col gap-2">
						<div className="flex items-center justify-between">
							<div className="flex flex-col gap-1">
								<Label>등록알림 보내기</Label>
								<p className="text-body2 text-label-assistive">
									디퍼들에게 공지 등록 PUSH 알림을 보내요
								</p>
							</div>
							<Switch checked={sendNotification} onCheckedChange={setSendNotification} disabled />
						</div>
					</div>
				</div>
			</Section>
		</AppLayout>
	);
}
