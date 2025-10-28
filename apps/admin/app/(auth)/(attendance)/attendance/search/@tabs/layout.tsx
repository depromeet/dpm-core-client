import type { ReactNode } from 'react';

import { AttendanceTabs } from './_components/attendance-tabs';

interface LayoutProps {
	children?: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
	return (
		<>
			<AttendanceTabs />
			{children}
		</>
	);
}
