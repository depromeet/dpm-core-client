import { type MutationOptions, mutationOptions } from '@tanstack/react-query';
import { auth } from '@dpm-core/api';

type LogoutMutationOptions = MutationOptions;

export const logoutMutationOptions = (options: LogoutMutationOptions = {}) =>
	mutationOptions({
		...options,
		mutationKey: ['logout'],
		mutationFn: auth.logout,
	});

export const loginMutationOptions = (
	options?: MutationOptions<
		Awaited<ReturnType<typeof auth.login>>,
		Error,
		Parameters<typeof auth.login>[0]
	>,
) =>
	mutationOptions({
		mutationKey: ['login'],
		mutationFn: auth.login,
		...options,
	});
