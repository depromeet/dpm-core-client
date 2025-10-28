'use client';

import { useEffect } from 'react';
import { gaTrackSessionEnter } from '@dpm-core/shared';

export const SessionPageTracker = () => {
	useEffect(() => {
		gaTrackSessionEnter('session-list');
	}, []);

	return null;
};
