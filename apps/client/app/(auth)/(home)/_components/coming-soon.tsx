'use client';

import type React from 'react';
import { toast } from '@dpm-core/shared';

interface FeatureComingSoonProps {
	children: React.ReactElement;
}

export const FeatureComingSoon = (props: FeatureComingSoonProps) => {
	const handleBlockInteraction = (event: React.SyntheticEvent) => {
		event.preventDefault();
		event.stopPropagation();
		toast.info('아직 준비 중인 기능이에요.');
	};

	const handleKeyDownCapture = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			handleBlockInteraction(event);
		}
	};

	return (
		<div
			style={{ display: 'contents' }}
			onClickCapture={handleBlockInteraction}
			onKeyDownCapture={handleKeyDownCapture}
			aria-disabled="true"
			{...props}
		/>
	);
};
