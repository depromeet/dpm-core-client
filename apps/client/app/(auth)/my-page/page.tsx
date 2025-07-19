import { ChevronLeft } from '@dpm-core/shared';
import * as motion from 'motion/react-client';
import { Link } from 'next-view-transitions';
import { Footer } from '@/components/footer';
import { MyPageAvatarInfo } from './_components/my-page-avatar-info';
import { MyPageDetailInfo } from './_components/my-page-detail-info';

const MyPage = () => {
	return (
		<motion.div
			className="w-full flex flex-col min-h-[inherit] bg-background-subtle"
			initial="initial"
			animate="animate"
			transition={{
				staggerChildren: 0.2,
			}}
		>
			<div className="h-12 flex items-center justify-center relative px-4 py-3 mb-5">
				<Link href="/" className="absolute left-4">
					<ChevronLeft />
				</Link>
				<h3 className="text-body1 font-semibold text-label-strong">마이페이지</h3>
			</div>

			<MyPageAvatarInfo />

			<MyPageDetailInfo />

			<Footer />
		</motion.div>
	);
};

export default MyPage;
