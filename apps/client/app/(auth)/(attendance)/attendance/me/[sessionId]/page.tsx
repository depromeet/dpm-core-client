import { ChevronLeft } from '@dpm-core/shared';
import Link from 'next/link';
import { Fragment } from 'react';
import { NavigationBar } from '@/components/navigation-bar';

interface AttendanceMeBySessionIdProps {
	params: Promise<{ sessionId: string }>;
}

export default async function page({ params }: AttendanceMeBySessionIdProps) {
	const { sessionId } = await params;

	return (
		<Fragment>
			<NavigationBar>
				<Link href="/attendance/me">
					<ChevronLeft />
				</Link>
				<h1 className="absolute left-1/2 -translate-x-1/2 font-semibold text-body1">
					내 출석 상세
				</h1>
			</NavigationBar>
			<section className="mt-5 px-4 mb-5">
				<h3 className="text-label-subtle text-body1 font-semibold mb-3">출석 정보</h3>
				<div className="flex flex-col gap-3 bg-background-subtle py-3 px-5 rouned-lg font-semibold text-body2">
					<div className="flex gap-4">
						<p className="w-17.5 text-label-assistive">출석 상태</p>
						<p className="text-label-subtle">출석</p>
					</div>
					<div className="flex gap-4">
						<p className="w-17.5 text-label-assistive">출석 시간</p>
						<p className="text-label-subtle">25년 00월 00일(토) 14:02</p>
					</div>
				</div>
			</section>
			<section className="mt-5 px-4 mb-5">
				<h3 className="text-label-subtle text-body1 font-semibold mb-3">세션 정보</h3>
				<div className="flex flex-col gap-3 bg-background-subtle py-3 px-5 rouned-lg font-semibold text-body2">
					<div className="flex gap-4">
						<p className="w-17.5 text-label-assistive">세션 주차</p>
						<p className="text-label-subtle">1주차</p>
					</div>
					<div className="flex gap-4">
						<p className="w-17.5 text-label-assistive">세션명</p>
						<p className="text-label-subtle">디프만 17기 OT</p>
					</div>
					<div className="flex gap-4">
						<p className="w-17.5 text-label-assistive">출석 날짜</p>
						<p className="text-label-subtle">25년 00월 00일(토) 14:02</p>
					</div>
					<div className="flex gap-4">
						<p className="w-17.5 text-label-assistive">세션 장소</p>
						<p className="text-label-subtle">온라인</p>
					</div>
				</div>
			</section>
		</Fragment>
	);
}
