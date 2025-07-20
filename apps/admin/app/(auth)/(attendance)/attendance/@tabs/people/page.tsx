import { Fragment } from 'react';
import { AttendanceFilter } from '../_components/attendance-filter';
import { AttendanceList } from '../_components/attendance-list';

export default async function page() {
	return (
		<Fragment>
			<section className="flex flex-col px-3 mt-3 gap-3.5">
				<AttendanceFilter />
			</section>
			<section className="px-4">
				<AttendanceList />
			</section>
		</Fragment>
	);
}
