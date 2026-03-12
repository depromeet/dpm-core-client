import Link from 'next/link';
import { TextLogo, UserAvatar } from '@dpm-core/shared';

import { NavigationBar } from '@/components/navigation-bar';

export const HomeHeader = () => {
	return (
		<NavigationBar className="bg-background-subtle">
			<TextLogo className="text-gray-400" />
			<div className="flex items-center">
				{/* <Link href="#" className="relative p-1.5">
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
						<title>notification-icon</title>
						<path
							d="M13.1875 16.8333C13.1875 18.5822 11.7604 20 10 20C8.23959 20 6.8125 18.5822 6.8125 16.8333H13.1875ZM10 1C13.3998 1 16.0707 3.51812 16.071 6.72309V10.1578L18.1358 13.1337C18.3787 13.3627 18.5 13.7067 18.5 14.0501C18.4998 14.9656 17.6501 15.7662 16.679 15.7664H3.32098C2.34983 15.8806 1.50019 15.0801 1.5 14.1646C1.5 13.8211 1.62134 13.4771 1.8642 13.2482L3.92902 10.2722V6.72309C3.92929 3.51812 6.60017 1 10 1Z"
							fill="#9CA3AF"
						/>
					</svg>
					<div className="absolute top-1.5 right-2 h-1.5 w-1.5 rounded-full bg-red-500" />
				</Link> */}
				<Link href="/my-page">
					<UserAvatar />
				</Link>
			</div>
		</NavigationBar>
	);
};
