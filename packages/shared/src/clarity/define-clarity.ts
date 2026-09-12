type ClarityPageKey<PageIds extends Record<string, string>> = Exclude<keyof PageIds, 'UNKNOWN'>;

type ClarityActionMap<PageIds extends Record<string, string>> = Record<
	ClarityPageKey<PageIds>,
	Readonly<Record<string, string>>
>;

type NoExtraKeys<Expected, Actual> = Actual & Record<Exclude<keyof Actual, keyof Expected>, never>;

/**
 * 앱별 Clarity 페이지 ID 객체의 문자열 리터럴 타입을 유지한다.
 *
 * 새 페이지를 추가할 때는 `snake_case` ID를 등록하고 앱의 pathname 매핑도 함께 추가한다.
 * 수집을 시작한 ID 값은 기존 데이터와의 연속성을 위해 변경하지 않는다.
 *
 * @example
 * const PAGE_ID = defineClarityPageIds({
 *   UNKNOWN: 'unknown',
 *   SESSION_CREATE: 'session_create',
 * });
 */
export const defineClarityPageIds = <
	const PageIds extends Readonly<Record<string, string>> & { readonly UNKNOWN: string },
>(
	pageIds: PageIds,
) => pageIds;

/**
 * 페이지별 Clarity 액션 ID 객체의 문자열 리터럴 타입을 유지한다.
 *
 * 모든 페이지 key를 선언하도록 검사하며 등록되지 않은 페이지 key와 오타를 허용하지 않는다.
 * 액션은 해당 페이지 객체 아래에 `snake_case`로 추가하고 페이지 접두사는 포함하지 않는다.
 * 수집을 시작한 ID 값은 기존 데이터와의 연속성을 위해 변경하지 않는다.
 *
 * @example
 * const ACTION_ID = defineClarityActionIds(PAGE_ID, {
 *   HOME: {
 *     VOC_BUTTON_CLICK: 'voc_button_click',
 *   },
 * });
 */
export const defineClarityActionIds = <
	const PageIds extends Record<string, string>,
	const ActionIds extends ClarityActionMap<PageIds>,
>(
	_pageIds: PageIds,
	actionIds: NoExtraKeys<ClarityActionMap<PageIds>, ActionIds>,
): ActionIds => actionIds;
