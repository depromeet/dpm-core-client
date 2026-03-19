import { AppHeader } from '@/components/app-header';
import { SafeAreaAppLayout } from '@/components/app-layout';
import { Footer } from '@/components/footer';

import { MyPageAvatarInfo } from './_components/my-page-avatar-info';
import { MyPageDetailInfo } from './_components/my-page-detail-info';
import { MyPageTracker } from './_components/my-page-tracker';

const MyPage = () => {
	return (
		<SafeAreaAppLayout>
			<MyPageTracker />
			<AppHeader title="마이페이지" />
			<main className="flex-1">
				<MyPageAvatarInfo />
				<MyPageDetailInfo />
			</main>
			<Footer />
		</SafeAreaAppLayout>
	);
};

export default MyPage;
