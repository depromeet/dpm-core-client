/**
 * 커밋 메시지 규칙: Conventional Commits
 *   <type>: <제목>
 *   예) feat: 게시글 목록 무한 스크롤 추가
 *
 * type: feat, fix, refactor, style, test, docs, chore, ci, build, perf, revert
 * 제목은 한글로 써도 된다.
 *
 * @type {import("@commitlint/types").UserConfig}
 */
export default {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'subject-case': [0], // 한글 제목을 쓰므로 대소문자 규칙은 끈다.
		'header-max-length': [2, 'always', 100],
		'body-max-line-length': [0], // 본문 줄 길이는 제한하지 않는다. (링크·로그 붙여넣기)
	},
};
