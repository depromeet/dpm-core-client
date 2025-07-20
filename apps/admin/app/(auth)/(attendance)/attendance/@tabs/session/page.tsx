import React from 'react';
import { AttendanceFilter } from '../_components/attendance-filter';

const Session = () => {
	return (
		<section className="flex flex-col px-3 mt-3 gap-3.5">
			<AttendanceFilter />
		</section>
	);
};

export default Session;
