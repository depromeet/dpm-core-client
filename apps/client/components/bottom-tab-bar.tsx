'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn } from '@dpm-core/shared';

const HomeIcon = () => {
	return (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
			<title>home</title>
			<path
				d="M15 21V13C15 12.7348 14.8946 12.4804 14.7071 12.2929C14.5196 12.1054 14.2652 12 14 12H10C9.73478 12 9.48043 12.1054 9.29289 12.2929C9.10536 12.4804 9 12.7348 9 13V21"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M3 10C2.99993 9.7091 3.06333 9.42165 3.18579 9.15775C3.30824 8.89384 3.4868 8.65983 3.709 8.47203L10.709 2.47303C11.07 2.16794 11.5274 2.00055 12 2.00055C12.4726 2.00055 12.93 2.16794 13.291 2.47303L20.291 8.47203C20.5132 8.65983 20.6918 8.89384 20.8142 9.15775C20.9367 9.42165 21.0001 9.7091 21 10V19C21 19.5305 20.7893 20.0392 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0392 3 19.5305 3 19V10Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

const AfterPartyIcon = () => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
			<title>after-party</title>
			<path
				d="M12 14L11 15"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M13.75 18.25L12.5 19.67"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M17.7748 5.65399C14.7961 6.27977 12.0639 7.75897 9.91159 9.91112C7.75926 12.0633 6.27984 14.7953 5.65381 17.774"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M18.8 9.29999C17.7789 9.57847 16.9103 10.2512 16.3852 11.1701C15.8601 12.089 15.7215 13.1789 16 14.2C16.2785 15.2211 16.9512 16.0897 17.8701 16.6148C18.789 17.1399 19.8789 17.2785 20.9 17"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M21.9638 20.732C22.0114 20.9028 22.0128 21.0831 21.9678 21.2546C21.9228 21.4261 21.833 21.5826 21.7077 21.7079C21.5823 21.8333 21.4259 21.9231 21.2544 21.9681C21.0829 22.0131 20.9025 22.0117 20.7318 21.964L2.73176 16.964C2.60522 16.9288 2.48686 16.8689 2.38344 16.788C2.28002 16.707 2.19357 16.6064 2.12903 16.492C2.06449 16.3776 2.02312 16.2516 2.00729 16.1212C1.99146 15.9908 2.00147 15.8585 2.03676 15.732C2.94501 12.4622 4.68335 9.48285 7.08298 7.08322C9.4826 4.68359 12.462 2.94525 15.7318 2.03701C15.8583 2.00172 15.9905 1.9917 16.1209 2.00753C16.2513 2.02337 16.3773 2.06473 16.4917 2.12927C16.6062 2.19381 16.7067 2.28026 16.7877 2.38368C16.8687 2.4871 16.9285 2.60546 16.9638 2.73201L21.9638 20.732Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

const AnnounceMentIcon = () => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
			<title>notice</title>
			<path
				d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H12.5"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M4 13.5V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M13.378 15.626C13.5752 15.4288 13.7317 15.1946 13.8384 14.9369C13.9452 14.6792 14.0001 14.403 14.0001 14.124C14.0001 13.8451 13.9452 13.5689 13.8384 13.3112C13.7317 13.0534 13.5752 12.8193 13.378 12.622C13.1807 12.4248 12.9466 12.2683 12.6889 12.1616C12.4311 12.0548 12.1549 11.9999 11.876 11.9999C11.597 11.9999 11.3208 12.0548 11.0631 12.1616C10.8054 12.2683 10.5712 12.4248 10.374 12.622L5.36398 17.634C5.12622 17.8716 4.9522 18.1654 4.85798 18.488L4.02098 21.358C3.99588 21.4441 3.99437 21.5353 4.01662 21.6221C4.03887 21.7089 4.08404 21.7882 4.14742 21.8516C4.2108 21.915 4.29006 21.9601 4.37689 21.9824C4.46372 22.0046 4.55493 22.0031 4.64098 21.978L7.51098 21.141C7.83364 21.0468 8.12735 20.8728 8.36498 20.635L13.378 15.626Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

const AttendanceIcon = () => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
			<title>attendance</title>
			<path
				d="M8 2V6"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M16 2V6"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M3 10H21"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M9 16L11 18L15 14"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

const TAB_LIST = [
	{
		href: '/',
		name: '홈',
		icon: <HomeIcon />,
	},
	{
		href: '/session',
		name: '세션',
		icon: <AfterPartyIcon />,
	},
	{
		href: '/attendance/me',
		name: '출석',
		icon: <AttendanceIcon />,
	},
	{
		href: '/announcement',
		name: '공지',
		icon: <AnnounceMentIcon />,
	},
	{
		href: '/after-party',
		name: '회식',
		icon: <AfterPartyIcon />,
	},
];

export const BottomTabBar = () => {
	const pathName = usePathname();
	return (
		<nav className="right-0 bottom-0 left-0 z-10 border-line-subtle border-t bg-background-normal">
			<ul className="flex h-19 items-center justify-between">
				{TAB_LIST.map((tab) => {
					const isActive = pathName === tab.href;
					return <BottomTabBarItem key={tab.href} {...tab} isActive={isActive} />;
				})}
			</ul>
		</nav>
	);
};

interface BottomTabBarItemProps {
	href: string;
	name: string;
	icon: ReactNode;
	isActive: boolean;
}

const BottomTabBarItem = (props: BottomTabBarItemProps) => {
	const { name, href, icon, isActive } = props;
	return (
		<li className="flex flex-1">
			<Link
				href={href}
				className={cn(
					'flex flex-1 flex-col items-center gap-1 text-gray-400',
					isActive && 'text-gray-700',
				)}
			>
				{icon}
				<span className="font-semibold text-caption1">{name}</span>
			</Link>
		</li>
	);
};
