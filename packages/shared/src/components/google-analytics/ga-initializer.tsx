'use client';

import { useEffect } from 'react';
import { gaInit } from '../../utils/google-analytics';

export const GAInitializer = () => {
	useEffect(() => {
		gaInit();
	}, []);

	return null;
};
