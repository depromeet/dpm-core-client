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
			<AppHeader title="마이페이지" className="mb-0 bg-background-subtle" />
			<div className="scrollbar-hide flex flex-1 flex-col overflow-auto">
				<section className="flex-1 pt-5">
					<MyPageAvatarInfo />
					<MyPageDetailInfo />
				</section>
				<Footer />
			</div>
		</SafeAreaAppLayout>
	);
};

export default MyPage;
