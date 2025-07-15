import { NavigationBar } from '@/components/navigation-bar';
import { Fragment } from 'react';
import { AttendanceForm } from './_components/attendance-form';

export default function page() {
	return (
		<Fragment>
			<NavigationBar>
				<h1 className="absolute left-1/2 -translate-x-1/2 font-semibold text-body1">출석</h1>
			</NavigationBar>
			<AttendanceForm />
		</Fragment>
	);
}
