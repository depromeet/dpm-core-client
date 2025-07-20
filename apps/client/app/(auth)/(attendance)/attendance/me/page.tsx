import {
	Button,
	ChevronLeft,
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@dpm-core/shared';

import * as motion from 'motion/react-client';
import Link from 'next/link';

import { NavigationBar } from '@/components/navigation-bar';
import { AttendanceSessionList } from '../_components/attendance-session-list';
import { AttendanceSitutationInfo } from '../_components/attendance-situation-info';

export default function page() {
	return (
		<motion.div
			initial="initial"
			animate="animate"
			transition={{
				staggerChildren: 0.2,
			}}
		>
			<NavigationBar>
				<Link href="/">
					<ChevronLeft />
				</Link>
				<h1 className="absolute left-1/2 -translate-x-1/2 font-semibold text-body1">
					내 출석 현황
				</h1>
				<Provision />
			</NavigationBar>
			<AttendanceSitutationInfo />
			<AttendanceSessionList />
		</motion.div>
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
			</DrawerContent>
		</Drawer>
	);
};
