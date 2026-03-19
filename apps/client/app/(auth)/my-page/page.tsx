import { AppHeader } from '@/components/app-header';
import { SafeAreaAppLayout } from '@/components/app-layout';
import { Footer } from '@/components/footer';

import { MyPageAvatarInfo } from './_components/my-page-avatar-info';
import { MyPageDetailInfo } from './_components/my-page-detail-info';
import { MyPageTracker } from './_components/my-page-tracker';

const MyPage = () => {
	return (
		<SafeAreaAppLayout hasBottomTabBar className="h-dvh">
			<MyPageTracker />
			<AppHeader title="마이페이지" className="sticky top-0 bg-background-subtle" />
			<div className="scrollbar-hide flex-1 overflow-auto">
				<section className="flex-1">
					<MyPageAvatarInfo />
					<MyPageDetailInfo />
				</section>
				<Footer />
			</div>
		</SafeAreaAppLayout>
	);
};

export default MyPage;
