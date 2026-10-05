'use client';

import { useState } from 'react';
import type { Part } from '@dpm-core/api';
import { Button, cn, Input } from '@dpm-core/shared';

const MAX_NICKNAME_LENGTH = 20;

/** 디자인 표기에 맞춘 직군 옵션 */
const PART_OPTIONS: { value: Exclude<Part, 'ETC'>; label: string }[] = [
	{ value: 'DESIGN', label: '디자이너' },
	{ value: 'WEB', label: '웹' },
	{ value: 'ANDROID', label: '안드로이드' },
	{ value: 'IOS', label: 'IOS' },
	{ value: 'SERVER', label: '서버' },
];

/**
 * 직군/닉네임 입력 폼
 * TODO: 저장 API 연동 — member_name 을 "{직군}_{닉네임}" 으로 누가 조합하는지(서버/프론트)
 * 백엔드 확인 후 handleSubmit 에서 호출한다.
 */
export const ProfileForm = () => {
	const [part, setPart] = useState<Part | null>(null);
	const [nickname, setNickname] = useState('');

	const trimmedNickname = nickname.trim();
	const isValid = part !== null && trimmedNickname.length > 0;

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!isValid) return;

		// TODO: 프로필 저장 API 연동 (part, trimmedNickname)
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-1 flex-col">
			<div className="flex flex-col gap-4 p-4">
				<div className="flex flex-col gap-2">
					<span className="font-semibold text-body2 text-label-subtle">직군</span>
					<div className="flex flex-wrap gap-2">
						{PART_OPTIONS.map(({ value, label }) => {
							const isSelected = part === value;

							return (
								<button
									key={value}
									type="button"
									aria-pressed={isSelected}
									onClick={() => setPart(value)}
									className={cn(
										'rounded-full border px-3 py-1 text-body2',
										isSelected
											? 'border-primary-normal font-semibold text-primary-normal'
											: 'border-line-normal font-medium text-label-assistive',
									)}
								>
									{label}
								</button>
							);
						})}
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<span className="font-semibold text-body2 text-label-subtle">닉네임</span>
					<p className="text-caption1 text-label-assistive">
						출결 시 운영진에게 노출되는 정보이므로, 본인 식별이 가능하게 입력해주세요.
					</p>
					<Input
						variant="line"
						value={nickname}
						onChange={(event) => setNickname(event.target.value)}
						placeholder="닉네임을 입력해주세요"
						maxLength={MAX_NICKNAME_LENGTH}
					/>
				</div>
			</div>

			<div className="mt-auto px-4 pb-4">
				<Button type="submit" variant="secondary" size="full" disabled={!isValid}>
					완료
				</Button>
			</div>
		</form>
	);
};
