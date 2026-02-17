/** 날짜 포맷 함수 */
export const afterPartyFormatDate = (date: Date) => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
	return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
};

/** 시간 포맷 함수 */
export const afterPartyFormatTime = (date: Date) => {
	const hours = date.getHours();
	const period = hours < 12 ? '오전' : '오후';
	const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
	return `${period} ${displayHours}시`;
};
