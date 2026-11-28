'use client';

import {
	createContext,
	type PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';

import { ClarityPageViewTracker } from '@/components/clarity-page-view-tracker';
import { CLARITY_ACTION_ID } from '@/constants/clarity';
import { useAuth } from '@/providers/auth-provider';

const bannerStateActions = {
	active: CLARITY_ACTION_ID.HOME.BANNER_STATE_ACTIVE,
	inactive: CLARITY_ACTION_ID.HOME.BANNER_STATE_INACTIVE,
	no_session: CLARITY_ACTION_ID.HOME.BANNER_STATE_NO_SESSION,
};

type HomeBannerState = keyof typeof bannerStateActions;

const HomeBannerStateContext = createContext<((state: HomeBannerState) => void) | null>(null);

export const HomeBannerStateTracker = ({ children }: PropsWithChildren) => {
	const { user } = useAuth();
	const [initialBannerState, setInitialBannerState] = useState<HomeBannerState | null>(null);
	const recordInitialBannerState = useCallback((state: HomeBannerState) => {
		setInitialBannerState((initialState) => initialState ?? state);
	}, []);
	const canTrackHomeView = user !== null && user.hasSeenApprovalWelcome !== false;

	return (
		<HomeBannerStateContext.Provider value={recordInitialBannerState}>
			{children}
			{canTrackHomeView && initialBannerState !== null ? (
				<ClarityPageViewTracker action={bannerStateActions[initialBannerState]} />
			) : null}
		</HomeBannerStateContext.Provider>
	);
};

interface HomeBannerStateReporterProps {
	state: HomeBannerState;
}

export const HomeBannerStateReporter = ({ state }: HomeBannerStateReporterProps) => {
	const reportBannerState = useContext(HomeBannerStateContext);

	if (reportBannerState === null) {
		throw new Error('HomeBannerStateReporter는 HomeBannerStateContext 안에서 사용해야합니다.');
	}

	useEffect(() => {
		reportBannerState(state);
	}, [reportBannerState, state]);

	return null;
};
