/**
 * 여러 값을 고른 필터의 트리거 라벨.
 * 아무것도 고르지 않으면 기본 라벨, 2개 이상이면 "{앞서 선택된 것} 외 {n}" 으로 줄인다.
 */
export function formatFilterLabel<T>(
	selected: T[],
	getLabel: (value: T) => string,
	emptyLabel: string,
): string {
	if (selected.length === 0) return emptyLabel;
	if (selected.length === 1) return getLabel(selected[0]);
	return `${getLabel(selected[0])} 외 ${selected.length - 1}`;
}
