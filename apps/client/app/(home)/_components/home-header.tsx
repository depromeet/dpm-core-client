import Link from 'next/link';
import { TextLogo, UserAvatar } from '@dpm-core/shared';

import { NavigationBar } from '@/components/navigation-bar';

export const HomeHeader = () => {
	return (
		<NavigationBar className="bg-background-subtle">
			<TextLogo className="text-gray-400" />
			<div className="flex items-center">
				<Link href="/my-page" data-coachmark="my-page">
					<UserAvatar />
				</Link>
			</div>
		</NavigationBar>
	);
};
