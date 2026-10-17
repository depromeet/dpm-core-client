import type { MemberRow } from '../_types';

/**
 * 서버가 중복 의심을 판정하는 기준과 같은 키.
 * (앞뒤 공백을 뺀 닉네임 + 실제 파트가 같으면 같은 사람으로 본다)
 */
function duplicateKey(row: MemberRow) {
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

export interface ApprovalPlan {
	/** 중복이 아니라 그대로 승인하면 되는 멤버 */
	approveIds: number[];
	merges: MergePlan[];
	/** 짝이 함께 선택되지 않아 병합할 수 없는 멤버 */
	unpaired: MemberRow[];
}

/**
 * 고른 멤버들을 "그냥 승인" 과 "병합 후 승인" 으로 나눈다.
 * 짝 중 하나만 골랐다면 승인하지 않고 unpaired 로 돌려보낸다.
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

		// 셋 이상이 묶여 있으면 짝을 지어 순서대로 병합한다.
		const group = [row, ...partners].sort((a, b) => a.id - b.id);
		for (const member of group) handled.add(member.id);

		const [retained, ...sources] = [...group].sort((a, b) => {
			const emailDiff = Number(Boolean(b.email)) - Number(Boolean(a.email));
			return emailDiff !== 0 ? emailDiff : a.id - b.id;
		});

		for (const source of sources) {
			merges.push({ retainedMemberId: retained.id, sourceMemberId: source.id });
		}
	}

	return { approveIds, merges, unpaired };
}
