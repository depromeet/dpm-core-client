import { AppLayout } from '@dpm-core/shared';
import { AppHeader } from '@/components/app-header';
import { Footer } from '@/components/footer';
import { MyPageAvatarInfo } from './_components/my-page-avatar-info';
import { MyPageDetailInfo } from './_components/my-page-detail-info';

const MyPage = () => {
	return (
		<AppLayout>
			<AppHeader title="마이페이지" />

			<MyPageAvatarInfo />

			<MyPageDetailInfo />

			<Footer />
		</AppLayout>
	);
};

export default MyPage;
