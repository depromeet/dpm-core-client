import Link from 'next/link';
import { TextLogo, UserAvatar } from '@dpm-core/shared';

import { NavigationBar } from '@/components/navigation-bar';

export const HomeNavbar = () => {
	return (
		<NavigationBar>
			<TextLogo className="text-gray-400" />

			<Link href="/my-page">
				<UserAvatar />
			</Link>
		</NavigationBar>
	);
};
