import { Fragment } from 'react';

import { SearchInput } from '../_components/search-input';
import { AttendanceFilter } from './_components/attendance-filter';
import { AttendanceList } from './_components/attendance-list';

export default async function page() {
	return (
		<Fragment>
			<section className="sticky top-0 flex flex-col gap-3.5 bg-white px-4 py-2.5">
				<SearchInput placeholder="디퍼 검색" />
				<AttendanceFilter />
			</section>
			<AttendanceList />
		</Fragment>
	);
}
