'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Part } from '@dpm-core/api';
import { Button, cn, Input } from '@dpm-core/shared';

import { PROFILE_FORM_ACTION } from '@/constants/clarity';
import { isProfileIncomplete } from '@/lib/profile-completion';
import { memberAuthQueryKey } from '@/providers/auth-provider';
import { useClarity } from '@/providers/client-clarity-adapter';
import { updateMyProfileMutationOptions } from '@/remotes/mutations/member';
import { getMyMemberInfoQuery, getMyProfileQuery } from '@/remotes/queries/member';

const MAX_NAME_LENGTH = 20;
const NAME_FORMAT_ERROR_MESSAGE = '이름은 한글로만 입력해주세요.';

/** 디자인 표기에 맞춘 직군 옵션 */
type SelectablePart = Exclude<Part, 'ETC'>;

const PART_OPTIONS: { value: SelectablePart; label: string }[] = [
	{ value: 'DESIGN', label: '디자이너' },
	{ value: 'WEB', label: '웹' },
	{ value: 'ANDROID', label: '안드로이드' },
	{ value: 'IOS', label: 'IOS' },
	{ value: 'SERVER', label: '서버' },
];

interface ProfileFormProps {
	/** 저장 성공 후 기본 이동(/pending) 대신 실행할 콜백. 반려 후 재입력처럼 저장 다음에 별도 처리가 필요할 때 쓴다. */
	onSubmitted?: () => void;
	/**
	 * 서버의 완료 플래그와 무관하게 항상 수정 가능하게 한다.
	 * 반려 후 재입력 화면처럼 이 화면에 들어왔다는 사실 자체가 수정 권한을 뜻하는 곳에서 쓴다.
	 */
	alwaysEditable?: boolean;
}

/**
 * 가입정보(이름/직군) 입력 폼
 * 서버가 이름·직군을 최초 1회만 받으므로, 이미 입력을 마친 값과 다른 값은 저장할 수 없다(409).
 */
export const ProfileForm = ({ onSubmitted, alwaysEditable = false }: ProfileFormProps = {}) => {
	const { data: profileResponse } = useQuery(getMyProfileQuery);
	const profile = profileResponse?.data;

	// 이전에 입력해 둔 값을 채우기 위해 프로필 조회가 끝난 뒤에 폼을 그린다.
	// 반려 후 재입력 대상자는 이전 이름/파트가 보존되어 내려오므로 그대로 기본값으로 쓰지만,
	// 파트를 한 번도 제출한 적 없는 최초 가입자는 서버가 내려주는 name(애플 로그인 시 애플 ID 등)을
	// 기본값으로 쓰지 않는다.
	if (!profile) return null;

	const savedPart =
		profile.part && profile.part !== 'UNASSIGNED' && profile.part !== 'ETC' ? profile.part : null;
	const hasPreviousSubmission = savedPart !== null;

	return (
		<ProfileFields
			initialName={hasPreviousSubmission ? profile.name : ''}
			initialPart={savedPart}
			isReadOnly={!alwaysEditable && !isProfileIncomplete(profile)}
			onSubmitted={onSubmitted}
		/>
	);
};

interface ProfileFieldsProps {
	initialName: string;
	initialPart: SelectablePart | null;
	/** 이미 입력을 마친 회원은 서버가 변경을 받지 않으므로(409) 값을 고칠 수 없게 한다. */
	isReadOnly?: boolean;
	onSubmitted?: () => void;
}

const ProfileFields = ({
	initialName,
	initialPart,
	isReadOnly = false,
	onSubmitted,
}: ProfileFieldsProps) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { track } = useClarity();
	const [name, setName] = useState(initialName);
	const [part, setPart] = useState<SelectablePart | null>(initialPart);
	/** 이름 입력 자체의 오류(형식 위반). 입력창 아래에 표시한다. */
	const [nameError, setNameError] = useState<string | null>(null);
	/** 이름과 무관한 저장 오류(409, 네트워크 등). 완료 버튼 위에 표시한다. */
	const [formError, setFormError] = useState<string | null>(null);

	const { mutate: updateProfile, isPending } = useMutation(updateMyProfileMutationOptions());

	const trimmedName = name.trim();
	const isValid = trimmedName.length > 0 && part !== null;

	const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
		setNameError(null);
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (isReadOnly || !isValid || part === null) return;

		setNameError(null);
		setFormError(null);

		updateProfile(
			{ name: trimmedName, part },
			{
				onSuccess: async () => {
					track(PROFILE_FORM_ACTION.SUBMIT_SUCCESS);
					await Promise.all([
						queryClient.invalidateQueries({ queryKey: memberAuthQueryKey }),
						queryClient.invalidateQueries({ queryKey: getMyMemberInfoQuery.queryKey }),
						queryClient.invalidateQueries({ queryKey: getMyProfileQuery.queryKey }),
					]);
					if (onSubmitted) {
						onSubmitted();
					} else {
						router.replace('/pending');
					}
				},
				onError: (error) => {
					const status = error.response?.status;
					if (status === 409) {
						track(PROFILE_FORM_ACTION.SUBMIT_FAIL_CONFLICT);
						setFormError('이미 등록된 정보는 변경할 수 없어요. 운영진에게 문의해주세요.');
					} else if (status === 400) {
						track(PROFILE_FORM_ACTION.SUBMIT_FAIL_NAME_INVALID);
						setNameError(NAME_FORMAT_ERROR_MESSAGE);
					} else {
						track(PROFILE_FORM_ACTION.SUBMIT_FAIL);
						setFormError('저장에 실패했어요. 다시 시도해주세요.');
					}
				},
			},
		);
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-1 flex-col">
			<div className="flex flex-col gap-1 px-4 pt-3 pb-5">
				<h1 className="font-bold text-headline2 text-label-normal tracking-[-0.44px]">
					회원 정보를 입력해주세요
				</h1>
				<p className="font-medium text-body2 text-label-assistive">
					지원 시와 회원 정보가 다를 경우 가입 승인이 반려될 수 있어요
				</p>
			</div>

			<div className="flex flex-col gap-4 p-4">
				<div className="flex flex-col gap-2">
					<span className="font-semibold text-body2 text-label-subtle">이름</span>
					<Input
						variant="line"
						value={name}
						onChange={handleNameChange}
						placeholder="이름을 입력해주세요"
						maxLength={MAX_NAME_LENGTH}
						readOnly={isReadOnly}
						aria-invalid={nameError !== null}
					/>
					{nameError && (
						<p className="font-medium text-caption1 text-red-400" role="alert">
							{nameError}
						</p>
					)}
				</div>

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
									disabled={isReadOnly}
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
			</div>

			<div className="mt-auto flex flex-col gap-3 px-4 pb-4">
				{formError && (
					<p className="text-center font-medium text-caption1 text-red-400" role="alert">
						{formError}
					</p>
				)}
				{isReadOnly ? (
					<p className="text-center font-medium text-body2 text-label-assistive">
						이름과 직군은 변경할 수 없어요. 변경이 필요하면 운영진에게 문의해주세요.
					</p>
				) : (
					<Button
						type="submit"
						variant="secondary"
						size="full"
						className="h-12 rounded-lg"
						disabled={!isValid || isPending}
					>
						완료
					</Button>
				)}
			</div>
		</form>
	);
};
