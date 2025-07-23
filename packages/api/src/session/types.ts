export interface Session {
	/**
	 * 세션 고유 아이디
	 */
	id: number;

	/**
	 * 주차
	 */
	week: number;

	/**
	 * 세션 이름
	 */
	eventName: string;

	/**
	 * ISO 8601 형식
	 */
	date: string;
}

export interface SessionDetail {
	/**
	 * 세션 고유 아이디
	 */
	sessionId: number;

	/**
	 * 주차
	 */
	week: number;

	/**
	 * 행사 이름
	 */
	eventName: string;

	/**
	 * 장소
	 */
	place: string;

	/**
	 * 온라인 여부
	 */
	isOnline: boolean;

	/**
	 * ISO 8601 형식
	 */
	date: string;

	/**
	 * 출석 시작 시간
	 * ISO 8601 형식
	 */
	attendanceStartTime: string;

	// /**
	// /* 출석 종료 시간
	//  * ISO 8601 형식
	//  */
	// attendanceEndTime: string;

	/**
	 * 출석 코드
	 * @todo
	 */
	attendanceCode: string;
}

export interface CurrentWeekSession {
	/**
	 * 세션 고유 아이디
	 */
	sessionId: number;

	/**
	 * 주차
	 */
	week: number;

	/**
	 * 행사 이름
	 */
	eventName: string;

	/**
	 * 장소
	 */
	place: string;

	/**
	 * 온라인 여부
	 */
	isOnline: boolean;

	/**
	 * ISO 8601 형식
	 */
	date: string;

	/**
	 * 출석 시작 시간
	 * ISO 8601 형식
	 */
	attendanceStartTime: string;

	/**
	 * 출석 종료 시간
	 * ISO 8601 형식
	 */
	attendanceEndTime: string;
}

export interface SessionWeeksReponse {
	sessions: {
		id: number;
		week: number;
	}[];
}
