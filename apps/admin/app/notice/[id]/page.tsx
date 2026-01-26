'use client';

import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import {
  Button,
  MemberProfile,
  type Profile,
  ReminderCallout,
  SidebarInset,
  TeamTabBar,
  toast,
} from '@dpm-core/shared';

import { EmptyView } from '@/components/attendance/EmptyView';
import { NoticeDetailHeader } from '@/components/notice/notice-detail-header';
import { NoticeTag } from '@/components/notice/notice-tag';

type TabType = 'unread' | 'read';

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
  const [selectedTab, setSelectedTab] = useState<TabType>('unread');

  // 목업 데이터
  const { title, date, readCount, tags, content } = {
    title: '{공지} 제목이 들어갑니다.',
    date: 'YYYY.MM.DD',
    readCount: 5,
    tags: ['default'] as Array<
      'default' | 'assignment' | 'individual' | 'team' | 'etc'
    >,
    content: `네이버페이 즉시할인 이벤트를 아래와 같이 진행하게 되어 안내드립니다.

■ 이벤트기간 : 2025년 12월 25일 ~ 2025년 12월 31일 (※ 단, 상기 일자 중 예산 소진 시 조기종료 될 수 있음)

■ 이벤트내용 : 이벤트 기간동안 현대홈쇼핑에서 네이버페이 10만원 이상 결제 시 3천원 즉시할인 (※ 실명인증 회원 기준 1인당 회차별 기간 내 1회)

■ 꼭 알아두세요!
• 이벤트 기간 내 현대홈쇼핑에서 네이버페이로 10만원 이상 결제하는 경우에 한해 할인 혜택이 적용됩니다.
• 할인 금액 및 적용 여부는 네이버페이 결제창 및 결제상세에서 확인 부탁드립니다.

네이버페이 즉시할인 이벤트를 아래와 같이 진행하게 되어 안내드립니다.

■ 이벤트기간 : 2025년 12월 25일 ~ 2025년 12월 31일 (※ 단, 상기 일자 중 예산 소진 시 조기종료 될 수 있음)

■ 이벤트내용 : 이벤트 기간동안 현대홈쇼핑에서 네이버페이 10만원 이상 결제 시 3천원 즉시할인 (※ 실명인증 회원 기준 1인당 회차별 기간 내 1회)

■ 꼭 알아두세요!
• 이벤트 기간 내 현대홈쇼핑에서 네이버페이로 10만원 이상 결제하는 경우에 한해 할인 혜택이 적용됩니다.
• 할인 금액 및 적용 여부는 네이버페이 결제창 및 결제상세에서 확인 부탁드립니다.`,
  };

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

  const handleBack = () => {
    router.push('/notice');
  };

  const handleEdit = () => {
    console.log('수정하기 클릭');
    // TODO: 공지 수정 페이지로 이동
  };

  const handleRemindSend = () => {
    console.log('리마인드 전송 클릭');
    // TODO: 리마인드 전송 API 호출
    toast.light('리마인드 알림이 전송되었어요.');
  };

  const currentMembers = selectedTab === 'unread' ? unreadMembers : readMembers;

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
        <div className="flex flex-1 overflow-hidden">
          {/* 좌측: 공지 상세 */}
          <div className="flex flex-1 flex-col gap-10 overflow-y-auto border-line-normal border-r p-10">
            {/* Title Section */}
            <div className="flex flex-col gap-2">
              <NoticeTag type={tags[0]} className="w-fit" />

              <div className="flex flex-col gap-2">
                <h2 className="font-semibold text-label-strong text-title1">
                  {title}
                </h2>

                <div className="flex items-center gap-2 text-caption1 text-label-assistive">
                  <span>{date}</span>
                  <div className="h-3 w-px bg-gray-400" />
                  <span>{readCount}명 읽음</span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="whitespace-pre-wrap font-medium text-body2 text-label-normal">
              {content}
            </div>
          </div>

          {/* 우측: 조회 현황 */}
          <div className="flex h-full w-100 flex-col bg-background-normal">
            {/* Tab */}
            <TeamTabBar
              tabs={[
                { id: 'unread', label: '안 읽은 디퍼' },
                { id: 'read', label: '읽은 디퍼' },
              ]}
              activeTabId={selectedTab}
              onTabChange={(tabId) => setSelectedTab(tabId as TabType)}
              className="w-full px-4 pt-3"
            />

            {/* Member List */}
            <div className="flex-1 overflow-y-auto bg-background-normal p-5">
              {currentMembers.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {currentMembers.map(({ id, name, team, role }) => (
                    <MemberProfile
                      key={id}
                      name={name}
                      team={team}
                      role={role}
                      showHover
                    />
                  ))}
                </div>
              ) : (
                <EmptyView message="모든 디퍼가 확인했어요!" />
              )}
            </div>

            {/* Footer */}
            <div className="border-line-normal border-t bg-background-normal p-5">
              <div className="flex flex-col gap-4">
                <ReminderCallout
                  title="리마인드 알림 일괄 전송"
                  description="안읽은 디퍼들에게 한번에 다 보낸다~ 이런 문구가 들어가면 될 듯?"
                />
                <Button size="lg" className="w-full" onClick={handleRemindSend}>
                  리마인드 전송
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default NoticeDetailPage;
