'use client';

import { useQuery } from '@tanstack/react-query';

import { getMyMemberInfoQuery, getNameHashTypeValidationQuery } from '@/remotes/queries/member';

/**
 * Apple 초기 가입자 프로필 설정 필요 여부 판단 훅
 *
 * Apple 로그인 가입자는 이름을 별도로 입력하지 않으면 name이 자동 생성된다.
 *  1. 이메일 가리기(Private Relay): name이 식별 불가능한 해시(id) 형식 → `isHashType`
 *  2. 실제 이메일 공유: name이 이메일의 local-part(@ 앞부분)로 들어옴
 *     (예: bnm0218@icloud.com → name "bnm0218")
 *
 * 카카오는 한글 실명, 이메일 가입은 사용자가 직접 입력한 이름이라
 * 위 두 패턴(해시 / 이메일 local-part 일치)에 해당하지 않는다.
 * → 둘 중 하나라도 해당하면 이름/직군 설정 바텀시트를 띄운다.
 */
export const useAppleProfileSetup = () => {
	const { data: memberResponse } = useQuery(getMyMemberInfoQuery);
	const memberName = memberResponse?.data.name ?? '';
	const memberEmail = memberResponse?.data.email ?? '';

	const { data: hashValidation } = useQuery(getNameHashTypeValidationQuery(memberName));

	// 이름이 이메일 local-part 와 동일 → Apple 자동 생성 이름으로 간주
	const emailLocalPart = memberEmail.split('@')[0];
	const isNameFromEmail = emailLocalPart.length > 0 && memberName === emailLocalPart;
	// 이름이 해시(id) 형식 → 이메일 가리기 가입자
	const isHashName = hashValidation?.data.isHashType === true;

	const isSetupRequired = memberName.length > 0 && (isHashName || isNameFromEmail);

	return {
		isSetupRequired,
		memberName,
		memberEmail,
	};
};
