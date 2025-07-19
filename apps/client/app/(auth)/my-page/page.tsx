import { fadeInOutVariatns, UserAvatar } from '@dpm-core/shared';
import * as motion from 'motion/react-client';
import { Link } from 'next-view-transitions';
import { NavigationBar } from '@/components/navigation-bar';

const MyPage = () => {
	return (
		<motion.div
			className="w-full flex flex-col min-h-[inherit]"
			initial="initial"
			animate="animate"
			transition={{
				staggerChildren: 0.2,
			}}
		>
			<NavigationBar>
				<Link href="/" className="text-primary-normal font-semibold">
					← 뒤로가기
				</Link>

				<h3 className="font-normal">마이페이지</h3>

				<UserAvatar />
			</NavigationBar>

			<motion.div variants={fadeInOutVariatns.variants} className="flex flex-col p-4 flex-1">
				<div className="bg-background-subtle rounded-lg p-6 mb-4">
					<h2 className="text-title1 font-bold mb-4">프로필 정보</h2>
					<div className="flex items-center gap-4 mb-6">
						<UserAvatar />
						<div>
							<h3 className="text-body1 font-semibold">홍길동</h3>
							<p className="text-body2 text-label-subtle">Frontend Developer</p>
						</div>
					</div>
				</div>

				<div className="space-y-3">
					<Link
						href="/settings"
						className="bg-background-subtle rounded-lg p-4 flex items-center justify-between hover:bg-background-strong transition-colors"
					>
						<span className="text-body1">설정</span>
						<span className="text-label-subtle">→</span>
					</Link>

					<Link
						href="/profile-edit"
						className="bg-background-subtle rounded-lg p-4 flex items-center justify-between hover:bg-background-strong transition-colors"
					>
						<span className="text-body1">프로필 수정</span>
						<span className="text-label-subtle">→</span>
					</Link>

					<Link
						href="/help"
						className="bg-background-subtle rounded-lg p-4 flex items-center justify-between hover:bg-background-strong transition-colors"
					>
						<span className="text-body1">도움말</span>
						<span className="text-label-subtle">→</span>
					</Link>
				</div>

				<div className="mt-auto pt-8">
					<Link
						href="/logout"
						className="bg-red-500 text-white rounded-lg p-4 text-center hover:bg-red-600 transition-colors"
					>
						로그아웃
					</Link>
				</div>
			</motion.div>
		</motion.div>
	);
};

export default MyPage;
