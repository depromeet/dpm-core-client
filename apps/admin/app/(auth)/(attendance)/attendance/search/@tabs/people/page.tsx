import { Fragment } from 'react';

import { SearchInput } from '../_components/search-input';
import { AttendanceFilter } from './_components/attendance-filter';
import { AttendanceList } from './_components/attendance-list';

export default async function page() {
	return (
		<Fragment>
			<section className="flex flex-col px-4 py-2.5 gap-3.5 sticky top-0 bg-white">
				<SearchInput placeholder="디퍼 검색" />
				<AttendanceFilter />
			</section>
			<AttendanceList />
		</Fragment>
	);
}
