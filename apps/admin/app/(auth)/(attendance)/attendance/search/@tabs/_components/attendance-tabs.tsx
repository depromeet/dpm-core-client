'use client';

import { redirect, useSelectedLayoutSegment } from 'next/navigation';

export const AttendanceTabs = () => {
	const tab = useSelectedLayoutSegment();
	if (tab !== 'session' && tab !== 'people') redirect('/attendance/search/session');
	return null;
};
