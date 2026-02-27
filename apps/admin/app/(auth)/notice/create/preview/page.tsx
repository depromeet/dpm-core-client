'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AppLayout, Button, ChevronLeft } from '@dpm-core/shared';

import { Section } from '@/components/section';
import { formatDateWithDay } from '@/lib/date';

export default function NoticePreviewPage() {
	const searchParams = useSearchParams();

	// URL 쿼리 파라미터에서 데이터 가져오기 (나중에 상태 관리로 변경 가능)
	const category = searchParams.get('category') || 'required';
	const title = searchParams.get('title') || '';
	const content = searchParams.get('content') || '';
	const isScheduled = searchParams.get('isScheduled') === 'true';
	const scheduledDate = searchParams.get('scheduledDate') ?? null;
	const scheduledTime = searchParams.get('scheduledTime') ?? '0000';
	const sendNotification = searchParams.get('sendNotification') === 'true';

	const scheduledAtLabel =
		scheduledDate && scheduledTime
			? `${formatDateWithDay(scheduledDate)} ${scheduledTime.slice(0, 2)}시 ${scheduledTime.slice(2)}분 부터`
			: null;

	return (
		<AppLayout className="bg-background-normal">
			{/* 상단 헤더 */}
			<header className="sticky top-0 z-10 border-line-normal border-b bg-background-normal">
				<div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-3 md:px-10 md:py-4">
					<Link href="/notice/create" className="flex items-center gap-2">
						<ChevronLeft className="text-icon-noraml" />
					</Link>
					<div className="flex items-center gap-2">
						<Button variant="secondary" className="h-12" asChild>
							<Link href="/notice/create">수정하기</Link>
						</Button>
					</div>
				</div>
			</header>

			<Section className="mx-auto w-full max-w-[800px] py-8">
				<div className="flex flex-col gap-8">
					{/* 카테고리 */}
					<div className="flex flex-col gap-2">
						<span className="font-semibold text-body1 text-label-subtle">카테고리</span>
						<div className="flex gap-2">
							{category === 'required' && (
								<span className="rounded-[170px] border border-primary-normal bg-background-normal px-3 py-1 font-medium text-body2 text-primary-normal">
									필수
								</span>
							)}
							{category === 'assignment' && (
								<span className="rounded-[170px] border border-primary-normal bg-background-normal px-3 py-1 font-medium text-body2 text-primary-normal">
									과제
								</span>
							)}
							{category === 'other' && (
								<span className="rounded-[170px] border border-primary-normal bg-background-normal px-3 py-1 font-medium text-body2 text-primary-normal">
									기타
								</span>
							)}
						</div>
					</div>

					{/* 공지 제목 */}
					<div className="flex flex-col gap-2">
						<span className="font-semibold text-body1 text-label-subtle">공지 제목</span>
						<h1 className="font-semibold text-headline1 text-label-strong">
							{title || '제목 없음'}
						</h1>
					</div>

					{/* 상세 내용 */}
					<div className="flex flex-col gap-2">
						<span className="font-semibold text-body1 text-label-subtle">상세 내용</span>
						<div
							className="prose prose-sm max-w-none"
							dangerouslySetInnerHTML={{ __html: content || '<p>내용 없음</p>' }}
						/>
					</div>

					{/* 공지 예약하기 */}
					<div className="flex flex-col gap-2">
						<div className="flex items-center justify-between">
							<span className="font-semibold text-body1 text-label-subtle">공지 예약하기</span>
							<span className="font-medium text-body2 text-label-normal">
								{isScheduled ? '예약됨' : '예약 안 함'}
							</span>
						</div>
						{isScheduled && scheduledAtLabel && (
							<p className="font-medium text-body2 text-label-normal">{scheduledAtLabel}</p>
						)}
					</div>

					{/* 등록알림 보내기 */}
					<div className="flex items-center justify-between">
						<div className="flex flex-col gap-1">
							<span className="font-semibold text-body1 text-label-subtle">등록알림 보내기</span>
							<p className="text-body2 text-label-assistive">
								디퍼들에게 공지 등록 PUSH 알림을 보내요
							</p>
						</div>
						<span className="font-medium text-body2 text-label-normal">
							{sendNotification ? '보내기' : '보내지 않기'}
						</span>
					</div>
				</div>
			</Section>
		</AppLayout>
	);
}
