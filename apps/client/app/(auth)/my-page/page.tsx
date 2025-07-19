import { AppHeader } from '@/components/app-header';
import { Footer } from '@/components/footer';
import { AppLayout } from '@/layout/app-layout';
import { MyPageAvatarInfo } from './_components/my-page-avatar-info';
import { MyPageDetailInfo } from './_components/my-page-detail-info';

const MyPage = () => {
	return (
		<AppLayout>
			<AppHeader title="마이페이지" backHref="/" />

			<MyPageAvatarInfo />

			<MyPageDetailInfo />

			<Footer />
		</AppLayout>
	);
};

export default MyPage;
