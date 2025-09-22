'use client';

import { gaTrackSessionEnter } from '@dpm-core/shared';
import { useEffect } from 'react';

export const SessionPageTracker = () => {
	useEffect(() => {
		gaTrackSessionEnter('session-list');
	}, []);

	return null;
};