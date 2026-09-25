import { AppHeader } from '@/components/app-header';
import { SafeAreaAppLayout } from '@/components/app-layout';
import { Footer } from '@/components/footer';

import { MyPageGeneral } from './_components/my-page-general';
import { MyPageInfo } from './_components/my-page-info';
import { MyPageTracker } from './_components/my-page-tracker';

const MyPage = () => {
	return (
		<SafeAreaAppLayout hasBottomTabBar className="h-dvh">
			<MyPageTracker />
			<AppHeader title="마이페이지" className="mb-0 bg-background-subtle" />
			<div className="scrollbar-hide flex flex-1 flex-col overflow-auto">
				<section className="flex flex-1 flex-col gap-2 px-4 py-5">
					<MyPageInfo />
					<MyPageGeneral />
				</section>
				<Footer />
			</div>
		</SafeAreaAppLayout>
	);
};

export default MyPage;
