// 세션 카드 목데이터 (Session Mock Data)
// 20개의 다양한 세션 예시 배열

export interface SessionMock {
	week: number; // 주차
	title: string; // 세션 제목
	datetime: string; // 세션 시간 (ISO8601 문자열)
	location: string; // 세션 장소
}

export const sessionMocks: SessionMock[] = [
	{ week: 1, title: '디프만 17기 OT', datetime: '2025-01-01T14:00:00+09:00', location: '온라인' },
	{ week: 2, title: '기획 워크숍', datetime: '2025-01-08T14:00:00+09:00', location: '서울 강남구' },
	{ week: 3, title: '디자인 세션', datetime: '2025-01-15T14:00:00+09:00', location: '온라인' },
	{ week: 4, title: '개발 세션', datetime: '2025-01-22T14:00:00+09:00', location: '서울 종로구' },
	{ week: 5, title: '중간 점검', datetime: '2025-01-29T14:00:00+09:00', location: '온라인' },
	{ week: 6, title: '기획 피드백', datetime: '2025-02-05T14:00:00+09:00', location: '서울 강남구' },
	{ week: 7, title: '디자인 피드백', datetime: '2025-02-12T14:00:00+09:00', location: '온라인' },
	{ week: 8, title: '개발 피드백', datetime: '2025-02-19T14:00:00+09:00', location: '서울 종로구' },
	{ week: 9, title: '중간 발표', datetime: '2025-02-26T14:00:00+09:00', location: '온라인' },
	{ week: 10, title: '네트워킹', datetime: '2025-03-05T14:00:00+09:00', location: '서울 강남구' },
	{ week: 11, title: '기획 마무리', datetime: '2025-03-12T14:00:00+09:00', location: '온라인' },
	{
		week: 12,
		title: '디자인 마무리',
		datetime: '2025-03-19T14:00:00+09:00',
		location: '서울 종로구',
	},
	{ week: 13, title: '개발 마무리', datetime: '2025-03-26T14:00:00+09:00', location: '온라인' },
	{ week: 14, title: '최종 점검', datetime: '2025-04-02T14:00:00+09:00', location: '서울 강남구' },
	{ week: 15, title: '최종 발표 준비', datetime: '2025-04-09T14:00:00+09:00', location: '온라인' },
	{ week: 16, title: '최종 발표', datetime: '2025-04-16T14:00:00+09:00', location: '서울 종로구' },
	{ week: 17, title: '회고 세션', datetime: '2025-04-23T14:00:00+09:00', location: '온라인' },
	{ week: 18, title: '수료식', datetime: '2025-04-30T14:00:00+09:00', location: '서울 강남구' },
	{ week: 19, title: '네트워킹 파티', datetime: '2025-05-07T14:00:00+09:00', location: '온라인' },
	{
		week: 20,
		title: '디프만 17기 종료',
		datetime: '2025-05-14T14:00:00+09:00',
		location: '서울 종로구',
	},
];
