'use client';

import { useEffect } from 'react';
import { gaTrackMyPageEnter } from '@dpm-core/shared';

export const MyPageTracker = () => {
	useEffect(() => {
		gaTrackMyPageEnter();
	}, []);

	return null;
};
