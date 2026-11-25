import Link from 'next/link';
import { TextLogo, UserAvatar } from '@dpm-core/shared';

import { NavigationBar } from '@/components/navigation-bar';

const HomeHeader = () => {
	return (
		<NavigationBar className="z-10 border-line-normal md:border-b">
			<div className="flex items-center justify-between bg-background-normal px-4 py-2 md:hidden">
				<TextLogo className="text-gray-400" />
				<Link href="/my-page">
					<UserAvatar />
				</Link>
			</div>
			<div className="hidden px-10 py-6 md:block">
				<h1 className="text-headline1 font-bold text-label-normal">홈</h1>
			</div>
		</NavigationBar>
	);
};

export default HomeHeader;
