'use client';

import React from 'react';
import { toast } from '@dpm-core/shared';

interface FeatureComingSoonProps {
	children: React.ReactElement<{ onClick: (e: React.MouseEvent) => void }>;
}

export const FeatureComingSoon = ({ children }: FeatureComingSoonProps) => {
	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		toast.info('아직 준비 중인 기능이에요.');
	};

	if (!React.isValidElement(children)) return null;

	return React.cloneElement(children, {
		onClick: handleClick,
	});
};
