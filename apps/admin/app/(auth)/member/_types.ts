import type {
	LoginMethod,
	ManagedMemberPart,
	ManagedMemberStatus,
	ManagedMemberType,
	MemberActivityStatus,
} from '@dpm-core/api';

/** 테이블 한 행이 그리는 데 필요한 값만 담은 화면 모델 */
export interface MemberRow {
	id: number;
	name: string;
	email: string | null;
	part: ManagedMemberPart;
	memberType: ManagedMemberType;
	/** 미배정은 0 */
	teamNumber: number;
	status: ManagedMemberStatus;
	/** status 와 수료 상태를 합쳐 계산한 표시용 활동 상태 */
	activityStatus: MemberActivityStatus;
	/** 수료 위험 또는 수료 불가 */
	isGraduationRisk: boolean;
	duplicateSuspected: boolean;
	missingInformation: boolean;
	/** 대표 로그인 수단(조회 전용). 연결 정보가 없으면 null */
	loginMethod: LoginMethod | null;
}

/**
 * 한 행에서 수정할 수 있는 컬럼.
 * activityStatus 는 AT_RISK 도 담을 수 있지만 선택지로는 고를 수 없다.
 * (수료 위험은 서버가 계산하는 값이라 현재 상태를 보여주기만 한다.)
 */
export interface MemberEditableFields {
	part: ManagedMemberPart;
	memberType: ManagedMemberType;
	teamNumber: number;
	activityStatus: MemberActivityStatus;
}

export type MemberEditableField = keyof MemberEditableFields;
