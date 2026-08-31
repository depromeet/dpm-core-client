import type { ComponentType, PropsWithChildren } from 'react';

type DeepValue<T> = T extends string
	? T
	: {
			[K in keyof T]: DeepValue<T[K]>;
		}[keyof T];

export type ClarityPageIdOf<PageIds extends Record<string, string>> = PageIds[keyof PageIds];

export type ClarityActionIdOf<ActionIds> = DeepValue<ActionIds>;

export type ClarityTagValue = string | string[];

export type ClarityTags = Readonly<Record<string, ClarityTagValue>>;

export interface ClarityMemberActor {
	status: 'member';
	customId: string;
	friendlyName?: string;
	tags?: ClarityTags;
}

export type ClarityActor = { status: 'checking' } | { status: 'guest' } | ClarityMemberActor;

export interface CreateClarityMemberActorParams {
	customId: string;
	cohort: string;
	isAdmin: boolean;
	status: string;
	friendlyName?: string;
}

export interface ClarityProviderProps<PageId extends string> extends PropsWithChildren {
	/** Clarity 프로젝트를 생성한 앱에서 사용하는 프로젝트 ID */
	projectId: string;
	/** 개발 환경 등에서 수집을 중단할 때 사용 */
	enabled?: boolean;
	actor: ClarityActor;
	pageId: PageId;
	tags?: ClarityTags;
}

export interface ClarityContextValue<ActionId extends string> {
	/** 현재 페이지 ID와 결합해 Clarity 커스텀 이벤트를 기록한다. */
	track: (action: ActionId) => void;
}

export type UseClarity<ActionId extends string> = () => ClarityContextValue<ActionId>;

export interface ClarityInstance<ActionId extends string, PageId extends string> {
	ClarityProvider: ComponentType<ClarityProviderProps<PageId>>;
	/**
	 * 현재 Provider의 사용자와 페이지 정보를 사용해 Clarity 커스텀 이벤트를 기록한다.
	 *
	 * @example
	 * const { track } = useClarity();
	 * track(CLARITY_ACTION_ID.HOME.BUTTON_CLICK);
	 */
	useClarity: UseClarity<ActionId>;
}

export interface ClarityDynamicPageRoute<PageId extends string> {
	pattern: RegExp;
	pageId: PageId;
}

export interface ClarityPageResolverConfig<PageId extends string> {
	unknownPageId: PageId;
	staticPages: Readonly<Partial<Record<string, PageId>>>;
	dynamicPages: ReadonlyArray<ClarityDynamicPageRoute<PageId>>;
}
