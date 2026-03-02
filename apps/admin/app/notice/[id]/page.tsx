'use client';

import { useRouter } from 'next/navigation';
import { use } from 'react';
import { type Profile, SidebarInset, toast } from '@dpm-core/shared';

import { NoticeDetailHeader } from '@/components/notice/notice-detail-header';

import { AssignmentDetail } from './components/assignment/assignment-detail';
import { NoticeContent } from './components/common/notice-content';
import { ReadStatusSidebar } from './components/common/read-status-sidebar';

interface Member {
	id: string;
	name: string;
	team: string;
	role: string;
	avatarSrc?: string;
}

interface NoticeDetailPageProps {
	params: Promise<{ id: string }>;
}

const NoticeDetailPage = ({ params: paramsPromise }: NoticeDetailPageProps) => {
	const params = use(paramsPromise);
	console.log('NoticeDetailPage params id:', params.id); // id 값 확인용 로그

	const router = useRouter();

	// 목업 데이터 - 공지 목록 페이지와 동일한 데이터
	const mockNotices: Record<
		string,
		{
			title: string;
			date: string;
			readCount: number;
			tags: Array<'default' | 'assignment' | 'individual' | 'team' | 'etc'>;
			content: string;
		}
	> = {
		'1': {
			title: '{공지} 제목이 들어갑니다.',
			date: 'YYYY.MM.DD',
			readCount: 0,
			tags: ['default'],
			content: `네이버페이 즉시할인 이벤트를 아래와 같이 진행하게 되어 안내드립니다.

■ 이벤트기간 : 2025년 12월 25일 ~ 2025년 12월 31일 (※ 단, 상기 일자 중 예산 소진 시 조기종료 될 수 있음)

■ 이벤트내용 : 이벤트 기간동안 현대홈쇼핑에서 네이버페이 10만원 이상 결제 시 3천원 즉시할인 (※ 실명인증 회원 기준 1인당 회차별 기간 내 1회)

■ 꼭 알아두세요!
• 이벤트 기간 내 현대홈쇼핑에서 네이버페이로 10만원 이상 결제하는 경우에 한해 할인 혜택이 적용됩니다.
• 할인 금액 및 적용 여부는 네이버페이 결제창 및 결제상세에서 확인 부탁드립니다.`,
		},
		'2': {
			title: '{과제 공지} 제목이 들어갑니다.',
			date: 'YYYY.MM.DD',
			readCount: 5,
			tags: ['assignment', 'individual'],
			content: `과제 공지 내용입니다.

■ 과제 기간 : 2025년 12월 25일 ~ 2025년 12월 31일

■ 과제 내용 : 개인 과제를 수행해주세요.

■ 제출 방법
• 과제 제출은 개별 제출로 진행됩니다.
• 기한 내 제출하지 않을 경우 불이익이 있을 수 있습니다.`,
		},
		'3': {
			title: '{팀 과제 공지} 제목이 들어갑니다.',
			date: 'YYYY.MM.DD',
			readCount: 3,
			tags: ['assignment', 'team'],
			content: `팀 과제 공지 내용입니다.

■ 과제 기간 : 2025년 12월 25일 ~ 2025년 12월 31일

■ 과제 내용 : 팀별 과제를 수행해주세요.

■ 제출 방법
• 과제 제출은 팀별 제출로 진행됩니다.
• 팀원 간 협업하여 과제를 완성해주세요.`,
		},
		'4': {
			title: '{일반 공지} 제목이 들어갑니다.',
			date: 'YYYY.MM.DD',
			readCount: 2,
			tags: ['default'],
			content: `일반 공지 내용입니다.

참고 사항을 안내드립니다.`,
		},
		'5': {
			title: '{팀 과제 공지 2} 제목이 들어갑니다.',
			date: 'YYYY.MM.DD',
			readCount: 4,
			tags: ['assignment', 'team'],
			content: `팀 과제 공지 내용입니다.

■ 과제 기간 : 2025년 12월 25일 ~ 2025년 12월 31일

■ 과제 내용 : 팀별 과제를 수행해주세요.`,
		},
	};

	// 현재 공지 데이터 가져오기
	const notice = mockNotices[params.id] || mockNotices['1'];
	const { title, date, readCount, tags, content } = notice;

	// 과제 공지인지 확인
	const isAssignment = tags.includes('assignment');

	const readProfiles: Profile[] = [
		{ id: '1', name: '디퍼 A', avatarSrc: undefined },
		{ id: '2', name: '디퍼 B', avatarSrc: undefined },
		{ id: '3', name: '디퍼 C', avatarSrc: undefined },
	];

	const unreadMembers: Member[] = [
		// { id: '1', name: '{디퍼} 이름', team: '{N}팀', role: '{디퍼} 직무' },
		// { id: '2', name: '{디퍼} 이름', team: '{N}팀', role: '{디퍼} 직무' },
		// { id: '3', name: '{디퍼} 이름', team: '{N}팀', role: '{디퍼} 직무' },
		// { id: '4', name: '{디퍼} 이름', team: '{N}팀', role: '{디퍼} 직무' },
		// { id: '5', name: '{디퍼} 이름', team: '{N}팀', role: '{디퍼} 직무' },
	];

	const readMembers: Member[] = [
		{ id: '6', name: '{디퍼} 이름', team: '{N}팀', role: '{디퍼} 직무' },
		{ id: '7', name: '{디퍼} 이름', team: '{N}팀', role: '{디퍼} 직무' },
	];

	const handleBack = () => router.push('/notice');

	const handleEdit = () => {
		console.log('수정하기 클릭');
		// TODO: 공지 수정 페이지로 이동
	};

	const handleRemindSend = () => {
		// TODO: 리마인드 전송 API 호출
		toast.light('리마인드 알림이 전송되었어요.');
	};

	return (
		<SidebarInset>
			<div className="flex h-screen w-full flex-col bg-background-normal">
				{/* Header */}
				<NoticeDetailHeader
					title="공지 상세"
					readProfiles={readProfiles}
					readCount={readCount}
					onBack={handleBack}
					onEdit={handleEdit}
				/>

				{/* Body */}
				{isAssignment ? (
					// 과제 상세 페이지
					<AssignmentDetail
						title={title}
						date={date}
						readCount={readCount}
						content={content}
						tags={tags}
					/>
				) : (
					// 일반 공지 상세 페이지
					<div className="flex flex-1 overflow-hidden">
						{/* 좌측: 공지 상세 */}
						<div className="flex flex-1 flex-col overflow-y-auto border-line-normal border-r p-10">
							<NoticeContent
								title={title}
								date={date}
								readCount={readCount}
								content={content}
								tags={tags}
							/>
						</div>

						{/* 우측: 조회 현황 */}
						<ReadStatusSidebar
							unreadMembers={unreadMembers}
							readMembers={readMembers}
							onSendReminder={handleRemindSend}
						/>
					</div>
				)}
			</div>
		</SidebarInset>
	);
};

export default NoticeDetailPage;
