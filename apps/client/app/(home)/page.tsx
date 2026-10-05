import { GAPageTracker } from '@dpm-core/shared';

import { SafeAreaAppLayout } from '@/components/app-layout';
import { BottomTabBar } from '@/components/bottom-tab-bar';
import { LastLoginRecorder } from '@/components/last-login-recorder';

import { AppleProfileSetupSheet } from './_components/apple-profile-setup-sheet';
import { HomeCheckAttendanceBanner } from './_components/home-attendance-banner';
import { HomeBannerList } from './_components/home-banner-list';
import { HomeContent } from './_components/home-content';
import { HomeHeader } from './_components/home-header';
import { KakaoLoginPromptSheet } from './_components/kakao-login-prompt-sheet';
import { UserActionList } from './_components/user-action-list';

export default function HomePage() {
	return (
		<SafeAreaAppLayout hasBottomTabBar className="h-dvh">
			<GAPageTracker type="home" />
			<HomeHeader />
			<main className="scrollbar-hide flex-1 overflow-auto">
				<HomeContent>
					<HomeCheckAttendanceBanner />
					<HomeBannerList />
				</HomeContent>
				<UserActionList />
			</main>
			<BottomTabBar />
			<AppleProfileSetupSheet />
			<KakaoLoginPromptSheet />
			<LastLoginRecorder />
		</SafeAreaAppLayout>
	);
}

// 접속하자마자 홈페이지
// 홈페이지
// 접근 가능
// voc 수집중
// 사용 가이드
// 세션
// 접근 가능
// 읽기만
// 출석, 공지, 회식, 내 정보
// 로그인 화면으로
