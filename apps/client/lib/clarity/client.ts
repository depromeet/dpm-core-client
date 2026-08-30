'use client';

import Clarity from '@microsoft/clarity';
import type { Member } from '@dpm-core/api';

import type { ClarityActionId, ClarityPageId } from '@/constants/clarity';
import { IS_PROD } from '@/lib/env';

const PROJECT_ID = 'yac8zy2ime';
const GUEST_CUSTOM_ID_KEY = 'clarity_guest_custom_id';

export type ClarityEnvironment = 'web' | 'ios' | 'android' | 'app_unknown';

export type ClarityActor =
	| { status: 'checking' }
	| { status: 'guest' }
	| { status: 'member'; user: Member };

interface ClarityContext {
	actor: ClarityActor;
	pageId: ClarityPageId;
	environment: ClarityEnvironment;
}

interface TrackClarityEventParams extends ClarityContext {
	action: ClarityActionId;
}

let initialized = false;
let lastContextKey: string | null = null;
let guestCustomIdInMemory: string | null = null;

const initClarity = () => {
	if (!IS_PROD || initialized || typeof window === 'undefined') return;

	Clarity.init(PROJECT_ID);
	initialized = true;
};

// 비회원일 때 고유 식별자 조회 혹은 생성
const getOrCreateGuestCustomId = () => {
	if (guestCustomIdInMemory) return guestCustomIdInMemory;

	try {
		const savedCustomId = localStorage.getItem(GUEST_CUSTOM_ID_KEY);

		if (savedCustomId) {
			guestCustomIdInMemory = savedCustomId;
			return savedCustomId;
		}
	} catch {
		// 저장소를 사용할 수 없는 환경에서는 현재 페이지가 열린 동안만 식별자를 유지
		guestCustomIdInMemory = crypto.randomUUID();
		return guestCustomIdInMemory;
	}

	guestCustomIdInMemory = crypto.randomUUID();

	try {
		localStorage.setItem(GUEST_CUSTOM_ID_KEY, guestCustomIdInMemory);
	} catch {
		// 저장에 실패해도 메모리 식별자(guestCustomIdInMemory)로 Clarity 수집을 계속 진행
	}

	return guestCustomIdInMemory;
};

const syncClarityContext = ({ actor, pageId, environment }: ClarityContext) => {
	initClarity();

	// 인증 확인 중에도 녹화는 진행하되, guest/member 식별은 인증 상태가 확정된 뒤 수행
	if (!initialized || actor.status === 'checking') return;

	// 사용자 식별자 생성
	const customId =
		actor.status === 'member'
			? `member:${actor.user.email}`
			: `guest:${getOrCreateGuestCustomId()}`;
	const contextKey =
		actor.status === 'member'
			? `${customId}:${pageId}:${environment}:${actor.user.cohort}:${actor.user.isAdmin}:${actor.user.status}`
			: `${customId}:${pageId}:${environment}`;

	// 이미 동일한 컨텍스트가 있으면 중복 처리 방지
	if (lastContextKey === contextKey) return;

	lastContextKey = contextKey;

	Clarity.identify(customId, undefined, pageId, actor.status === 'guest' ? 'guest' : undefined);
	Clarity.setTag('auth_status', actor.status);
	Clarity.setTag('user_environment', environment);

	if (actor.status === 'member') {
		Clarity.setTag('user_cohort', actor.user.cohort);
		Clarity.setTag('user_authority', actor.user.isAdmin ? 'ORGANIZER' : 'DEEPER');
		Clarity.setTag('user_status', actor.user.status);
	}
};

const trackClarityEvent = ({ actor, pageId, action, environment }: TrackClarityEventParams) => {
	syncClarityContext({ actor, pageId, environment });

	if (!initialized) return;

	Clarity.event(`${pageId}_${action}`);
};

export { syncClarityContext, trackClarityEvent };
