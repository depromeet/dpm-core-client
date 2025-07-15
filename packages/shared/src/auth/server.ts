import { betterAuth } from 'better-auth';

export const auth = betterAuth({
	// 기본 설정
	secret: 'TEMP_SECRET',
});
