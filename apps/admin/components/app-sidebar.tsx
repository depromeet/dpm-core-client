'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import type { Part } from '@dpm-core/api';
import {
	Button,
	ChevronRight,
	cn,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
	TextLogo,
	useIsTablet,
} from '@dpm-core/shared';

import { SESSION_ID } from '@/app/(auth)/(attendance)/attendance/search/@tabs/const/const';
import { VocBanner } from '@/app/(auth)/(home)/_components/voc-banner';
import { cohort } from '@/constants/cohort';
import { isExistPart } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { logoutMutationOptions } from '@/remotes/mutations/auth';
import { withdrawMutationOptions } from '@/remotes/mutations/member';

const ICON_COLOR_ACTIVE = '#374151';
const ICON_COLOR_INACTIVE = '#D1D5DB';

interface IconProps {
	active?: boolean;
}

const IconHome = ({ active }: IconProps) => {
	const fill = active ? ICON_COLOR_ACTIVE : ICON_COLOR_INACTIVE;
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
			<path fillRule="evenodd" clipRule="evenodd" d="M0.429 4.80398C0 5.58525 0 6.52987 0 8.41747V9.67313C0 12.8906 -9.83477e-08 14.5002 0.9669 15.5001C1.9338 16.5 3.48892 16.5 6.6 16.5H9.9C13.0111 16.5 14.567 16.5 15.5331 15.5001C16.4992 14.5002 16.5 12.8914 16.5 9.67313V8.4183C16.5 6.52988 16.5 5.58607 16.071 4.80398C15.6436 4.02105 14.8607 3.53595 13.2957 2.5641L11.6457 1.54028C9.99157 0.51315 9.1641 0 8.25 0C7.3359 0 6.50925 0.51315 4.8543 1.54028L3.2043 2.5641C1.63927 3.53595 0.857175 4.02105 0.429 4.80398ZM7.63125 13.2C7.63125 13.3641 7.69644 13.5215 7.81248 13.6375C7.92852 13.7536 8.0859 13.8187 8.25 13.8187C8.4141 13.8187 8.57148 13.7536 8.68752 13.6375C8.80356 13.5215 8.86875 13.3641 8.86875 13.2V10.725C8.86875 10.5609 8.80356 10.4035 8.68752 10.2875C8.57148 10.1714 8.4141 10.1062 8.25 10.1062C8.0859 10.1062 7.92852 10.1714 7.81248 10.2875C7.69644 10.4035 7.63125 10.5609 7.63125 10.725V13.2Z" fill={fill} />
		</svg>
	);
};
const IconAttendance = ({ active }: IconProps) => {
	const fill = active ? ICON_COLOR_ACTIVE : ICON_COLOR_INACTIVE;
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
			<path d="M4.48021 0.611111C4.48021 0.449034 4.41864 0.293596 4.30905 0.17899C4.19946 0.0643848 4.05082 0 3.89583 0C3.74085 0 3.59221 0.0643848 3.48262 0.17899C3.37303 0.293596 3.31146 0.449034 3.31146 0.611111V1.89852C2.18946 1.99222 1.45393 2.222 0.913183 2.7883C0.371662 3.35378 0.151937 4.12378 0.0615542 5.2963H15.5218C15.4314 4.12296 15.2117 3.35378 14.6701 2.7883C14.1294 2.222 13.3931 1.99222 12.2719 1.8977V0.611111C12.2719 0.449034 12.2103 0.293596 12.1007 0.17899C11.9911 0.0643848 11.8425 0 11.6875 0C11.5325 0 11.3839 0.0643848 11.2743 0.17899C11.1647 0.293596 11.1031 0.449034 11.1031 0.611111V1.84393C10.585 1.83333 10.0037 1.83333 9.35 1.83333H6.23333C5.57961 1.83333 4.99835 1.83333 4.48021 1.84393V0.611111Z" fill={fill} />
			<path fillRule="evenodd" clipRule="evenodd" d="M15.5833 8.35185V9.98148C15.5833 13.0541 15.5833 14.5909 14.6701 15.545C13.757 16.4992 12.2882 16.5 9.35 16.5H6.23333C3.2951 16.5 1.82559 16.5 0.913183 15.545C0.00077911 14.5901 0 13.0541 0 9.98148V8.35185C0 7.66822 8.70787e-09 7.06037 0.0101292 6.51852H15.5732C15.5833 7.06037 15.5833 7.66822 15.5833 8.35185ZM11.2979 13.2407C11.6079 13.2407 11.9052 13.112 12.1243 12.8828C12.3435 12.6535 12.4667 12.3427 12.4667 12.0185C12.4667 11.6944 12.3435 11.3835 12.1243 11.1543C11.9052 10.9251 11.6079 10.7963 11.2979 10.7963C10.9879 10.7963 10.6907 10.9251 10.4715 11.1543C10.2523 11.3835 10.1292 11.6944 10.1292 12.0185C10.1292 12.3427 10.2523 12.6535 10.4715 12.8828C10.6907 13.112 10.9879 13.2407 11.2979 13.2407Z" fill={fill} />
		</svg>
	);
};
const IconSession = ({ active }: IconProps) => {
	const fill = active ? ICON_COLOR_ACTIVE : ICON_COLOR_INACTIVE;
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="15" height="17" viewBox="0 0 15 17" fill="none">
			<path d="M5.2963 0C4.97214 0 4.66127 0.130392 4.43205 0.362492C4.20284 0.594591 4.07407 0.909386 4.07407 1.23762V2.06271C4.07407 2.39094 4.20284 2.70574 4.43205 2.93784C4.66127 3.16994 4.97214 3.30033 5.2963 3.30033H9.37037C9.69452 3.30033 10.0054 3.16994 10.2346 2.93784C10.4638 2.70574 10.5926 2.39094 10.5926 2.06271V1.23762C10.5926 0.909386 10.4638 0.594591 10.2346 0.362492C10.0054 0.130392 9.69452 0 9.37037 0H5.2963Z" fill={fill} />
			<path fillRule="evenodd" clipRule="evenodd" d="M2.85185 1.68069C1.82681 1.73845 1.17985 1.90347 0.716222 2.37376C-4.85667e-08 3.09901 0 4.26568 0 6.59901V11.5495C0 13.8837 -4.85667e-08 15.0503 0.716222 15.7756C1.43163 16.5 2.58459 16.5 4.88889 16.5H9.77778C12.0821 16.5 13.235 16.5 13.9504 15.7756C14.6667 15.0495 14.6667 13.8837 14.6667 11.5495V6.59901C14.6667 4.26568 14.6667 3.09901 13.9504 2.37376C13.4868 1.90347 12.8399 1.73845 11.8148 1.68069V2.06271C11.8148 2.71918 11.5573 3.34877 11.0989 3.81297C10.6404 4.27717 10.0187 4.53795 9.37037 4.53795H5.2963C4.64799 4.53795 4.02624 4.27717 3.56781 3.81297C3.10939 3.34877 2.85185 2.71918 2.85185 2.06271V1.68069ZM3.25926 9.69472C3.09718 9.69472 2.94174 9.75992 2.82714 9.87597C2.71253 9.99202 2.64815 10.1494 2.64815 10.3135C2.64815 10.4777 2.71253 10.635 2.82714 10.7511C2.94174 10.8671 3.09718 10.9323 3.25926 10.9323H9.77778C9.93985 10.9323 10.0953 10.8671 10.2099 10.7511C10.3245 10.635 10.3889 10.4777 10.3889 10.3135C10.3889 10.1494 10.3245 9.99202 10.2099 9.87597C10.0953 9.75992 9.93985 9.69472 9.77778 9.69472H3.25926ZM3.25926 12.5825C3.09718 12.5825 2.94174 12.6477 2.82714 12.7638C2.71253 12.8798 2.64815 13.0372 2.64815 13.2013C2.64815 13.3654 2.71253 13.5228 2.82714 13.6389C2.94174 13.7549 3.09718 13.8201 3.25926 13.8201H7.74074C7.90282 13.8201 8.05826 13.7549 8.17286 13.6389C8.28747 13.5228 8.35185 13.3654 8.35185 13.2013C8.35185 13.0372 8.28747 12.8798 8.17286 12.7638C8.05826 12.6477 7.90282 12.5825 7.74074 12.5825H3.25926Z" fill={fill} />
		</svg>
	);
};

const IconAnnounce = ({ active }: IconProps) => {
	const fill = active ? ICON_COLOR_ACTIVE : ICON_COLOR_INACTIVE;
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
			<mask id="mask0_20920_801" style={{ maskType: 'luminance' } as React.CSSProperties} maskUnits="userSpaceOnUse" x="0" y="0" width="13" height="17">
				<path fillRule="evenodd" clipRule="evenodd" d="M6.375 0C2.8543 0 0 2.9206 0 6.5229C0 8.45495 0.8211 10.1906 2.12415 11.3849C2.55765 11.7819 2.8798 12.0768 3.1076 12.291C3.22298 12.3994 3.33633 12.5099 3.4476 12.6225L3.47565 12.6531C3.6771 12.9081 3.72045 12.9727 3.74595 13.0322C3.77145 13.0917 3.791 13.1682 3.84115 13.4912C3.86155 13.6187 3.86325 13.8363 3.86325 14.4304V14.456C3.86325 14.8036 3.86325 15.1037 3.88535 15.3493C3.9083 15.6094 3.9593 15.8678 4.09615 16.1101C4.24915 16.3812 4.46845 16.6056 4.73365 16.762C4.96995 16.9023 5.2224 16.9541 5.47655 16.9779C5.7171 17 6.01035 17 6.35035 17H6.39965C6.73965 17 7.0329 17 7.27345 16.9779C7.52845 16.9541 7.7792 16.9014 8.0172 16.762C8.28299 16.6044 8.50257 16.3795 8.65385 16.1101C8.78985 15.8678 8.84085 15.6103 8.86465 15.3493C8.88675 15.1028 8.88675 14.8036 8.8859 14.456V14.4304C8.8859 13.8363 8.88845 13.6187 8.908 13.4912C8.959 13.1682 8.9777 13.0917 9.00405 13.0322C9.02955 12.9727 9.0729 12.9073 9.27435 12.6531L9.2769 12.6505L9.28115 12.6455L9.3024 12.6225L9.3772 12.546C9.44067 12.482 9.52907 12.397 9.6424 12.291C9.8702 12.0768 10.1923 11.7818 10.6258 11.3841C11.2979 10.7656 11.8339 10.014 12.1996 9.17706C12.5653 8.34014 12.7528 7.43623 12.75 6.5229C12.75 2.9206 9.8957 0 6.375 0ZM7.7095 15.2422C7.71573 15.1782 7.71998 15.1051 7.72225 15.0229H5.02775C5.03002 15.1051 5.03398 15.1782 5.03965 15.2422C5.0558 15.4207 5.08215 15.4853 5.1 15.5176C5.1509 15.607 5.22412 15.6817 5.3125 15.7344C5.34395 15.753 5.40685 15.7803 5.5811 15.7964C5.763 15.8134 6.00355 15.8134 6.375 15.8134C6.74645 15.8134 6.987 15.8134 7.1689 15.7964C7.34315 15.7803 7.40605 15.7539 7.4375 15.7344C7.52588 15.6817 7.5991 15.607 7.65 15.5176C7.66785 15.4853 7.6942 15.4207 7.7095 15.2422Z" fill="white" />
				<path fillRule="evenodd" clipRule="evenodd" d="M4.48266 9.64722C4.55515 9.60528 4.6352 9.57803 4.71822 9.56704C4.80125 9.55605 4.88563 9.56152 4.96654 9.58315C5.04745 9.60478 5.12331 9.64214 5.18977 9.69309C5.25624 9.74405 5.31201 9.8076 5.35391 9.88012C5.44711 10.0418 5.58126 10.1761 5.74286 10.2695C5.90447 10.3629 6.08782 10.4121 6.27446 10.4121C6.4611 10.4121 6.64445 10.3629 6.80605 10.2695C6.96766 10.1761 7.10181 10.0418 7.19501 9.88012C7.23698 9.80768 7.29281 9.74421 7.35931 9.69334C7.42581 9.64247 7.50167 9.6052 7.58257 9.58365C7.66348 9.5621 7.74783 9.5567 7.83082 9.56776C7.91381 9.57881 7.99382 9.6061 8.06626 9.64807C8.1387 9.69004 8.20217 9.74587 8.25304 9.81237C8.30391 9.87887 8.34118 9.95473 8.36273 10.0356C8.38427 10.1165 8.38968 10.2009 8.37862 10.2839C8.36757 10.3669 8.34028 10.4469 8.29831 10.5193C7.99348 11.0452 7.49647 11.4322 6.91196 11.5988V12.7497C6.91196 12.9188 6.84479 13.0809 6.72524 13.2005C6.60568 13.3201 6.44353 13.3872 6.27446 13.3872C6.10538 13.3872 5.94323 13.3201 5.82368 13.2005C5.70412 13.0809 5.63696 12.9188 5.63696 12.7497V11.5988C5.05214 11.4324 4.55479 11.0453 4.24976 10.5193C4.20782 10.4468 4.18057 10.3668 4.16958 10.2838C4.15859 10.2007 4.16406 10.1163 4.18569 10.0354C4.20732 9.95453 4.24468 9.87867 4.29563 9.81221C4.34659 9.74574 4.41014 9.68912 4.48266 9.64722Z" fill="black" />
			</mask>
			<g mask="url(#mask0_20920_801)">
				<path d="M-3.39941 -1.7002H17.0006V18.6998H-3.39941V-1.7002Z" fill={fill} />
			</g>
		</svg>
	);
};
const IconMember = ({ active }: IconProps) => {
	const fill = active ? ICON_COLOR_ACTIVE : ICON_COLOR_INACTIVE;
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
			<path fillRule="evenodd" clipRule="evenodd" d="M8.5 17C13.1946 17 17 13.1946 17 8.5C17 3.80545 13.1946 0 8.5 0C3.80545 0 0 3.80545 0 8.5C0 13.1946 3.80545 17 8.5 17ZM5.43745 11.5201C5.48737 11.4528 5.55006 11.396 5.62194 11.3529C5.69383 11.3098 5.7735 11.2814 5.85639 11.2692C5.93928 11.2569 6.02377 11.2611 6.10503 11.2816C6.18629 11.302 6.26272 11.3383 6.32995 11.3883C6.94875 11.8473 7.6959 12.1125 8.5 12.1125C9.3041 12.1125 10.0513 11.8464 10.6701 11.3883C10.7371 11.3361 10.8138 11.2979 10.8959 11.2758C10.9779 11.2538 11.0635 11.2483 11.1476 11.2598C11.2318 11.2712 11.3128 11.2994 11.3859 11.3426C11.459 11.3858 11.5228 11.4432 11.5734 11.5114C11.624 11.5796 11.6605 11.6572 11.6807 11.7397C11.701 11.8221 11.7045 11.9078 11.6911 11.9917C11.6778 12.0756 11.6478 12.1559 11.6029 12.2281C11.5581 12.3002 11.4993 12.3626 11.4299 12.4117C10.5839 13.044 9.55625 13.3862 8.5 13.3875C7.44376 13.3862 6.41614 13.044 5.57005 12.4117C5.43424 12.311 5.34398 12.1605 5.31911 11.9933C5.29425 11.8261 5.33681 11.6559 5.43745 11.5201ZM11.9 7.225C11.9 7.9288 11.5192 8.5 11.05 8.5C10.5808 8.5 10.2 7.9288 10.2 7.225C10.2 6.5212 10.5808 5.95 11.05 5.95C11.5192 5.95 11.9 6.5212 11.9 7.225ZM5.95 8.5C6.4192 8.5 6.8 7.9288 6.8 7.225C6.8 6.5212 6.4192 5.95 5.95 5.95C5.4808 5.95 5.1 6.5212 5.1 7.225C5.1 7.9288 5.4808 8.5 5.95 8.5Z" fill={fill} />
		</svg>
	);
};

const SIDEBAR_ITEMS = [
	{
		title: '홈',
		href: '/',
		icon: IconHome,
		matchPath: '/',
	},
	{
		title: '출석',
		href: `/attendance/search/session?week=${SESSION_ID}`,
		icon: IconAttendance,
		matchPath: '/attendance',
	},
	{
		title: '세션',
		href: '/session',
		icon: IconSession,
		matchPath: '/session',
	},
	{
		title: '공지',
		href: '/announcement',
		icon: IconAnnounce,
		matchPath: '/announcement',
	},
	{
		title: '멤버 관리',
		href: '/member',
		icon: IconMember,
		matchPath: '/member',
	},
];

export const AppSidebar = () => {
	const pathname = usePathname();

	const isActive = (matchPath: string) => {
		if (matchPath === '/') return pathname === '/';
		return pathname.startsWith(matchPath);
	};

	return (
		<Sidebar collapsible="icon" className="border-line-normal border-r">
			<SidebarHeader className="p-4">
				<Link href="/" className="flex items-center justify-center px-4.5 py-2.5">
					<TextLogo className="hidden h-5 w-36 text-gray-400 lg:block" />
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="block lg:hidden">
						<title>Logo</title>
						<path
							d="M12 -0.000488281C18.3214 -0.000468593 23.5012 4.88754 23.966 11.0901H14.1697L17.3319 7.92798L16.1319 6.72798L12.9093 9.95052V5.4539H11.2729V10.0117L7.98984 6.72859L6.78995 7.92849L9.95156 11.0901H5.45431V12.9083H9.95146L6.78954 16.0703L7.98954 17.2703L11.2729 13.9868V18.5447H12.9093V14.0478L16.1323 17.2708L17.3322 16.0709L14.1696 12.9083H23.966C23.5015 19.1112 18.3217 23.9995 12 23.9995C5.3726 23.9995 2.71132e-05 18.6269 0 11.9996C0 5.37217 5.37258 -0.000488281 12 -0.000488281Z"
							fill="#9CA3AF"
						/>
						<path
							d="M24 11.9996C24 12.0099 23.9998 12.0202 23.9998 12.0305V11.9685C23.9998 11.9788 24 11.9892 24 11.9996Z"
							fill="#9CA3AF"
						/>
					</svg>
				</Link>
			</SidebarHeader>
			<SidebarContent className="justify-between">
				<SidebarGroup className="p-4">
					<SidebarGroupLabel className="sr-only">Sidebar Menu</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{SIDEBAR_ITEMS.map((item) => {
								const active = isActive(item.matchPath);
								return (
									<SidebarMenuItem key={item.href}>
										<SidebarMenuButton asChild className="h-auto gap-1 p-2 lg:h-12">
											<Link href={item.href} className="flex flex-col gap-2 lg:flex-row lg:gap-3">
												<item.icon active={active} />
												<span className={cn('font-semibold text-body2', active ? 'text-label-normal' : 'text-label-subtle')}>
													{item.title}
												</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup className="p-4">
					<SidebarGroupContent>
						<VocBanner />
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarSeparator className="m-0" />
			<SidebarFooter className="px-2.5 py-4">
				<SideBarUserMenu />
			</SidebarFooter>
		</Sidebar>
	);
};

const SideBarUserMenu = () => {
	const isTablet = useIsTablet();
	const { user } = useAuth();

	if (!user) return null;

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton className="flex h-auto cursor-pointer items-center">
							<SideBarProfile part={user.cohort as Exclude<Part, 'ETC'>} name={user.name} />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="flex w-(--radix-dropdown-menu-trigger-width) flex-col gap-[15px] rounded-xl border border-line-normal bg-background-normal px-3 py-4 shadow-[0_-4px_21.1px_0_rgba(0,0,0,0.12)] max-lg:w-[220px] lg:mb-1.5"
						side={isTablet ? 'right' : 'top'}
						align="end"
						sideOffset={18}
					>
						<DropdownMenuLabel className="p-0 font-semibold text-body2 text-label-assistive">
							<div className="mb-3 flex items-center gap-4">
								<span className="w-[25px] shrink-0">메일</span>
								<span className="truncate font-medium">{user.email}</span>
							</div>
							<div className="flex items-center gap-4">
								<span className="w-[25px] shrink-0">기수</span>
								<span className="font-medium text-body1 text-label-subtle">{user.cohort}기</span>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator className="my-0" />
						<DropdownMenuGroup>
							<LogoutAlert />
							<WithdrawAlert />
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
};

interface SidebarProfileProps extends React.ComponentProps<'div'> {
	part: Exclude<Part, 'ETC'>;
	name: string;
	size?: number;
}

const SideBarProfile = (props: SidebarProfileProps) => {
	const { part, name, size = 28 } = props;

	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-1 lg:flex-row lg:justify-start">
			<div className={cn('rounded-full bg-background-strong')}>
				<Image
					width={size}
					height={size}
					src={isExistPart(part) ? cohort[part] : cohort.WEB}
					alt={`${part}_프로필_이미지`}
				/>
			</div>
			<div className="flex flex-col gap-0.5">
				<span className="font-semibold text-body1">{name}</span>
			</div>
		</div>
	);
};

const LogoutAlert = () => {
	const router = useRouter();

	const redirectToLogin = () => {
		router.replace('/login');
	};

	const { mutate: logoutMutate, isPending: isLogoutPending } = useMutation(
		logoutMutationOptions({
			onSuccess: () => {
				redirectToLogin();
			},
		}),
	);

	const handleLogout = () => {
		logoutMutate();
	};

	const isDisabled = isLogoutPending;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					size="none"
					variant="none"
					className="flex h-12 w-full justify-between rounded-lg px-1 font-medium text-body1 text-label-subtle hover:bg-background-subtle"
				>
					로그아웃
					<ChevronRight className="text-icon-noraml" width={18} height={18} />
				</Button>
			</DialogTrigger>
			<DialogContent showCloseButton={false} className="sm:max-w-[425px]">
				<DialogHeader className="text-left">
					<DialogTitle>로그아웃</DialogTitle>
					<DialogDescription>정말 로그아웃할까요?</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="assistive" size="lg">
							돌아가기
						</Button>
					</DialogClose>
					<Button variant="secondary" size="lg" disabled={isDisabled} onClick={handleLogout}>
						로그아웃
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

const WithdrawAlert = () => {
	const router = useRouter();

	const redirectToLogin = () => {
		router.replace('/login');
	};

	const { mutate: withdrawMutate, isPending: isWithdrawPending } = useMutation(
		withdrawMutationOptions({
			onSuccess: () => {
				redirectToLogin();
			},
		}),
	);

	const handleWithdraw = () => {
		withdrawMutate();
	};

	const isDisabled = isWithdrawPending;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					size="none"
					variant="none"
					className="flex h-12 w-full justify-between rounded-lg px-1 font-medium text-body1 text-label-subtle hover:bg-background-subtle"
				>
					탈퇴
					<ChevronRight className="text-icon-noraml" width={18} height={18} />
				</Button>
			</DialogTrigger>
			<DialogContent showCloseButton={false} className="sm:max-w-[425px]">
				<DialogHeader className="text-left">
					<DialogTitle>탈퇴하기</DialogTitle>
					<DialogDescription>
						지금 디프만 코어 어드민에서 탈퇴하면다시 가입하기 어려워요.
						<br />
						그래도 정말 탈퇴할까요?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="assistive" size="lg">
							돌아가기
						</Button>
					</DialogClose>
					<Button variant="secondary" size="lg" disabled={isDisabled} onClick={handleWithdraw}>
						탈퇴하기
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
