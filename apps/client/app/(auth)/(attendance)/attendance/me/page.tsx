import {
	AppLayout,
	Button,
	ChevronLeft,
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@dpm-core/shared';
import Link from 'next/link';
import { NavigationBar } from '@/components/navigation-bar';
import { AttendanceMe } from '../_components/attendance-me';

export default function AttendanceMePage() {
	return (
		<AppLayout>
			<NavigationBar>
				<Link href="/">
					<ChevronLeft />
				</Link>
				<h1 className="absolute left-1/2 -translate-x-1/2 font-semibold text-body1">
					내 출석 현황
				</h1>
				<Provision />
			</NavigationBar>
			<AttendanceMe />
		</AppLayout>
	);
}

const Provision = () => {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button
					variant="none"
					size="sm"
					className="bg-background-normal text-label-subtle border rounded-[100px] border-line-noraml"
				>
					규정
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>출석 규정 안내</DrawerTitle>
				</DrawerHeader>
				<div className="mx-5 mt-2 px-6 py-10 bg-background-strong rounded-lg mb-3" />
			</DrawerContent>
		</Drawer>
	);
};
