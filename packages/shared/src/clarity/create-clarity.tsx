'use client';

import { useCallback, useEffect } from 'react';
import Clarity from '@microsoft/clarity';

import { createContext } from '../components/create-context';
import type {
	ClarityContextValue,
	ClarityInstance,
	ClarityProviderProps,
	ClarityTags,
	UseClarity,
} from './types';

const GUEST_CUSTOM_ID_KEY_PREFIX = 'clarity_guest_custom_id';
const LEGACY_GUEST_CUSTOM_ID_KEY = GUEST_CUSTOM_ID_KEY_PREFIX;

const serializeTags = (tags: ClarityTags) =>
	JSON.stringify(
		Object.entries(tags)
			.sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
			.map(([key, value]) => [key, value]),
	);

/**
 * 앱별 액션과 페이지 ID 타입을 유지하는 Clarity Provider와 hook을 생성한다.
 * 한 앱에서는 반환된 Provider를 하나의 고정된 projectId로 사용한다.
 */
export const createClarity = <
	ActionId extends string,
	PageId extends string = string,
>(): ClarityInstance<ActionId, PageId> => {
	const [ClarityContextProvider, useClarityContext] = createContext<ClarityContextValue<ActionId>>(
		'Clarity',
		{ track: () => undefined },
	);
	const useClarity: UseClarity<ActionId> = useClarityContext;

	let initializedProjectId: string | null = null;
	let lastContextKey: string | null = null;
	let guestCustomIdInMemory: string | null = null;

	const initClarity = (projectId: string, enabled: boolean) => {
		if (!enabled || !projectId || typeof window === 'undefined') return false;

		if (initializedProjectId) {
			return initializedProjectId === projectId;
		}

		Clarity.init(projectId);
		initializedProjectId = projectId;
		return true;
	};

	const getOrCreateGuestCustomId = (projectId: string) => {
		if (guestCustomIdInMemory) return guestCustomIdInMemory;

		const storageKey = `${GUEST_CUSTOM_ID_KEY_PREFIX}:${projectId}`;

		try {
			const projectCustomId = localStorage.getItem(storageKey);
			const savedCustomId = projectCustomId ?? localStorage.getItem(LEGACY_GUEST_CUSTOM_ID_KEY);

			if (savedCustomId) {
				guestCustomIdInMemory = savedCustomId;

				// 기존 client 식별자를 프로젝트별 저장 키로 옮겨 사용자 연속성을 유지
				if (!projectCustomId) {
					try {
						localStorage.setItem(storageKey, savedCustomId);
					} catch {
						// 마이그레이션 저장에 실패해도 기존 식별자를 그대로 사용
					}
				}

				return savedCustomId;
			}
		} catch {
			// 저장소를 사용할 수 없는 환경에서는 현재 페이지가 열린 동안만 식별자를 유지
			guestCustomIdInMemory = crypto.randomUUID();
			return guestCustomIdInMemory;
		}

		guestCustomIdInMemory = crypto.randomUUID();

		try {
			localStorage.setItem(storageKey, guestCustomIdInMemory);
		} catch {
			// 저장 실패 시에도 메모리 식별자로 수집을 계속 진행
		}

		return guestCustomIdInMemory;
	};

	const syncClarityContext = ({
		projectId,
		enabled,
		actor,
		pageId,
		tags = {},
	}: Omit<ClarityProviderProps<PageId>, 'children'>) => {
		if (!initClarity(projectId, enabled ?? true) || actor.status === 'checking') return;

		const customId =
			actor.status === 'member'
				? `member:${actor.customId}`
				: `guest:${getOrCreateGuestCustomId(projectId)}`;
		const contextTags: ClarityTags = {
			auth_status: actor.status,
			...tags,
			...(actor.status === 'member' ? actor.tags : undefined),
		};
		const contextKey = `${projectId}:${customId}:${pageId}:${serializeTags(contextTags)}`;

		if (lastContextKey === contextKey) return;

		lastContextKey = contextKey;

		Clarity.identify(
			customId,
			undefined,
			pageId,
			actor.status === 'member' ? actor.friendlyName : 'guest',
		);

		for (const [key, value] of Object.entries(contextTags)) {
			Clarity.setTag(key, value);
		}
	};

	const ClarityProvider = ({
		projectId,
		enabled = true,
		actor,
		pageId,
		tags,
		children,
	}: ClarityProviderProps<PageId>) => {
		useEffect(() => {
			syncClarityContext({ projectId, enabled, actor, pageId, tags });
		}, [actor, enabled, pageId, projectId, tags]);

		const track = useCallback(
			(action: ActionId) => {
				syncClarityContext({ projectId, enabled, actor, pageId, tags });

				if (initializedProjectId !== projectId) return;

				Clarity.event(`${pageId}_${action}`);
			},
			[actor, enabled, pageId, projectId, tags],
		);

		return <ClarityContextProvider track={track}>{children}</ClarityContextProvider>;
	};

	return { ClarityProvider, useClarity };
};
