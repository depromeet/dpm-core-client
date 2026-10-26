import type { MemberRow } from '../_types';

/**
 * 서버가 중복 의심을 판정하는 기준과 같은 키.
 * (앞뒤 공백을 뺀 닉네임 + 실제 파트가 같으면 같은 사람으로 본다)
 */
export function duplicateKey(row: MemberRow) {
	return `${row.name.trim()}|${row.part}`;
}

/** 중복 의심인 행과 같은 묶음에 속한 다른 행들 */
export function findDuplicatePartners(row: MemberRow, rows: MemberRow[]): MemberRow[] {
	const key = duplicateKey(row);
	return rows.filter((candidate) => candidate.id !== row.id && duplicateKey(candidate) === key);
}

export interface MergePlan {
	/** 통합 후 유지하고 승인할 계정 */
	retainedMemberId: number;
	/** 로그인 수단을 옮긴 뒤 정리할 계정 */
	sourceMemberId: number;
}

/** 미승인 계정(source)과, 같은 사람으로 보이는 이미 승인된 계정(approved) 한 쌍 */
export interface ApprovedMergePair {
	source: MemberRow;
	approved: MemberRow;
}

export interface ApprovalPlan {
	/** 중복이 아니라 그대로 승인하면 되는 멤버 */
	approveIds: number[];
	/**
	 * 병합 API 에 보낼 쌍. 미승인끼리의 병합과, 미승인 계정을 승인된 계정에 합치는 병합이 함께 담긴다.
	 * 승인된 계정에 합치는 병합은 approvedPairs 에도 같은 쌍이 들어 있다.
	 */
	merges: MergePlan[];
	/** merges 중 승인된 계정을 남기는 쌍. planApproval 은 비워서 돌려주고, 승인 계정 조회 뒤 채운다. */
	approvedPairs: ApprovedMergePair[];
	/** 짝이 함께 선택되지 않았거나, 셋 이상이 함께 선택되어 병합할 수 없는 멤버 */
	unpaired: MemberRow[];
	/**
	 * unpaired 중 셋 이상이 같은 묶음으로 선택된 경우가 있는지.
	 * merge API 는 한 번에 두 계정만 병합한다. (미승인끼리, 또는 미승인 계정을 승인된 계정에 합칠 때)
	 * 병합은 호출 즉시 유지 계정을 승인 처리하므로, 같은 계정에 두 번째 병합을 또
	 * 시도하면 "이미 PENDING 이 아님" 으로 실패한다. 그래서 셋 이상은 한 번에 처리하지 않고
	 * 사용자가 두 개씩 나눠서 처리하도록 안내한다.
	 */
	hasOversizedGroup: boolean;
}

/**
 * 고른 멤버들을 "그냥 승인" 과 "병합 후 승인" 으로 나눈다.
 * 짝 중 하나만 골랐거나 셋 이상을 묶어 골랐다면 승인하지 않고 unpaired 로 돌려보낸다.
 *
 * 유지할 계정은 표시 이메일이 있는 쪽을, 둘 다 있거나 없으면 ID 가 작은 쪽을 고른다.
 * (서버가 어느 계정을 유지할지 정해주지 않으므로 항상 같은 결과가 나오도록 둔 규칙)
 */
export function planApproval(selected: MemberRow[], allRows: MemberRow[]): ApprovalPlan {
	const selectedIds = new Set(selected.map((row) => row.id));
	const approveIds: number[] = [];
	const merges: MergePlan[] = [];
	const unpaired: MemberRow[] = [];
	const handled = new Set<number>();
	let hasOversizedGroup = false;

	for (const row of selected) {
		if (handled.has(row.id)) continue;

		if (!row.duplicateSuspected) {
			approveIds.push(row.id);
			handled.add(row.id);
			continue;
		}

		const partners = findDuplicatePartners(row, allRows).filter((partner) =>
			selectedIds.has(partner.id),
		);

		if (partners.length === 0) {
			unpaired.push(row);
			handled.add(row.id);
			continue;
		}

		const group = [row, ...partners];
		for (const member of group) handled.add(member.id);

		// 셋 이상은 한 번의 요청 흐름으로 안전하게 병합할 수 없다 (위 hasOversizedGroup 설명 참고).
		if (group.length > 2) {
			unpaired.push(...group);
			hasOversizedGroup = true;
			continue;
		}

		const [retained, source] = [...group].sort((a, b) => {
			const emailDiff = Number(Boolean(b.email)) - Number(Boolean(a.email));
			return emailDiff !== 0 ? emailDiff : a.id - b.id;
		});

		merges.push({ retainedMemberId: retained.id, sourceMemberId: source.id });
	}

	return { approveIds, merges, approvedPairs: [], unpaired, hasOversizedGroup };
}
