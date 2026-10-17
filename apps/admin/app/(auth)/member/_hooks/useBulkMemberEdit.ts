'use client';

import { useCallback, useMemo, useState } from 'react';

import { toEditableFields } from '../_lib/build-member-changes';
import type { MemberEditableField, MemberEditableFields, MemberRow } from '../_types';

/** 선택한 행들이 같은 값을 가질 때만 그 값을, 섞여 있으면 null 을 돌려준다. */
function commonValue<K extends MemberEditableField>(
	rows: MemberRow[],
	field: K,
): MemberEditableFields[K] | null {
	if (rows.length === 0) return null;

	const [first, ...rest] = rows.map((row) => toEditableFields(row)[field]);
	return rest.every((value) => value === first) ? first : null;
}

/**
 * 여러 행의 같은 컬럼을 한 번에 고칠 때 쓰는 임시 값 보관소.
 * 모달에서 고른 값은 여기 쌓이기만 하고, 저장은 호출하는 쪽이 결정한다.
 */
export const useBulkMemberEdit = (selectedRows: MemberRow[]) => {
	const [draft, setDraft] = useState<Partial<MemberEditableFields>>({});
	const [openField, setOpenField] = useState<MemberEditableField | null>(null);

	const reset = useCallback(() => {
		setDraft({});
		setOpenField(null);
	}, []);

	const stage = useCallback(
		<K extends MemberEditableField>(field: K, value: MemberEditableFields[K]) => {
			setDraft((prev) => ({ ...prev, [field]: value }));
			setOpenField(null);
		},
		[],
	);

	/** 모달을 열 때 보여줄 초기 선택값. 아직 고른 적이 없으면 공통값에서 시작한다. */
	const currentValueOf = useCallback(
		<K extends MemberEditableField>(field: K): MemberEditableFields[K] | null =>
			draft[field] ?? commonValue(selectedRows, field),
		[draft, selectedRows],
	);

	const stagedFields = useMemo(() => Object.keys(draft) as MemberEditableField[], [draft]);

	return {
		draft,
		stagedFields,
		hasChanges: stagedFields.length > 0,
		openField,
		openModal: setOpenField,
		closeModal: useCallback(() => setOpenField(null), []),
		stage,
		currentValueOf,
		reset,
	};
};
