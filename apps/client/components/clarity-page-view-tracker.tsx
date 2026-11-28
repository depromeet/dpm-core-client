'use client';

import { useEffect, useRef } from 'react';

import type { ClarityActionId } from '@/constants/clarity';
import { useClarity } from '@/providers/client-clarity-adapter';

interface ClarityPageViewTrackerProps {
	action: ClarityActionId;
}

export const ClarityPageViewTracker = ({ action }: ClarityPageViewTrackerProps) => {
	const { track } = useClarity();
	const hasTrackedView = useRef(false);

	useEffect(() => {
		if (hasTrackedView.current) return;
		hasTrackedView.current = true;

		try {
			track(action);
		} catch {
			// 분석 이벤트 실패가 화면에 영향을 주지 않도록 한다.
		}
	}, [action, track]);

	return null;
};
