import { Fragment, type ReactNode } from 'react';
import { AttendanceTabs } from './_components/attendance-tabs';

interface LayoutProps {
	children?: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
	return (
		<Fragment>
			<AttendanceTabs />
			{children}
		</Fragment>
	);
}
