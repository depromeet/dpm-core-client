'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

import { toEditableFields } from '../_lib/build-member-changes';
import type { MemberEditableFields, MemberRow } from '../_types';

/**
 * 행 하나를 인라인으로 고치는 동안의 임시 값과 이탈 확인을 맡는다.
 * 저장을 어떻게 하는지는 모르고, 고치는 중인 행과 임시 값만 들고 있는다.
 */
export const useInlineMemberEdit = () => {
	const [editingRow, setEditingRow] = useState<MemberRow | null>(null);
	const [draft, setDraft] = useState<MemberEditableFields | null>(null);
	/** 이탈 확인 모달에서 "나가기" 를 눌렀을 때 이어서 할 일 */
	const pendingActionRef = useRef<(() => void) | null>(null);
	const [isExitGuardOpen, setExitGuardOpen] = useState(false);

	const isDirty = useMemo(() => {
		if (!editingRow || !draft) return false;
		const original = toEditableFields(editingRow);
		return (Object.keys(original) as Array<keyof MemberEditableFields>).some(
			(key) => original[key] !== draft[key],
		);
	}, [editingRow, draft]);

	const close = useCallback(() => {
		setEditingRow(null);
		setDraft(null);
	}, []);

	/** 수정 중인 다른 행이 있으면 그 행의 이탈 확인을 먼저 거친다. */
	const guard = useCallback(
		(action: () => void) => {
			if (!isDirty) {
				action();
				return;
			}
			pendingActionRef.current = action;
			setExitGuardOpen(true);
		},
		[isDirty],
	);

	const start = useCallback(
		(row: MemberRow) => {
			guard(() => {
				setEditingRow(row);
				setDraft(toEditableFields(row));
			});
		},
		[guard],
	);

	const change = useCallback(
		<K extends keyof MemberEditableFields>(field: K, value: MemberEditableFields[K]) => {
			setDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
		},
		[],
	);

	const cancel = useCallback(() => {
		guard(close);
	}, [guard, close]);

	const confirmExit = useCallback(() => {
		setExitGuardOpen(false);
		close();
		pendingActionRef.current?.();
		pendingActionRef.current = null;
	}, [close]);

	const dismissExit = useCallback(() => {
		setExitGuardOpen(false);
		pendingActionRef.current = null;
	}, []);

	return {
		editingRow,
		editingId: editingRow?.id ?? null,
		draft,
		isDirty,
		start,
		change,
		cancel,
		close,
		/** 수정 중이면 확인을 받고 나서 action 을 실행한다. */
		guard,
		exitGuard: { open: isExitGuardOpen, confirm: confirmExit, dismiss: dismissExit },
	};
};
