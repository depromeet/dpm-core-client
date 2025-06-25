import { betterAuth } from 'better-auth';
import { genericOAuth } from 'better-auth/plugins';

export const auth = betterAuth({
	plugins: [
		genericOAuth({
			config: [
				{
					clientId: '',
					clientSecret: '',
					providerId: '',
					// getUserInfo(tokens) {},
					// mapProfileToUser(profile) {},
				},
			],
		}),
	],
});
