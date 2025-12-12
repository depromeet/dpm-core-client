'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import IconAttendance from '@/assets/icons/icon_attendance.png';
import IconHome from '@/assets/icons/icon_home.png';
import IconSession from '@/assets/icons/icon_session.png';
import IconSettlement from '@/assets/icons/icon_settlement.png';
import { cohort } from '@/constants/cohort';
import { isExistPart } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { logoutMutationOptions } from '@/remotes/mutations/auth';
import { withdrawMutationOptions } from '@/remotes/mutations/member';

const SIDEBAR_ITEMS = [
	{
		title: '홈',
		href: '/',
		icon: IconHome,
	},
	{
		title: '출석',
		href: `/attendance/search/session?week=${SESSION_ID}`,
		icon: IconAttendance,
	},
	{
		title: '세션',
		href: '/session',
		icon: IconSession,
	},
	{
		title: '정산',
		href: '#',
		icon: IconSettlement,
	},
];

export const AppSidebar = () => {
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
							{SIDEBAR_ITEMS.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild className="h-auto gap-1 p-2 lg:h-12">
										<Link href={item.href} className="flex flex-col gap-2 lg:flex-row lg:gap-3">
											<Image width={20} height={20} src={item.icon} alt={item.title} />
											<span className="font-semibold text-body2 text-label-subtle">
												{item.title}
											</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
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
