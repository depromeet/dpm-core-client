import { auth } from '@dpm-core/api';
import { type MutationOptions, mutationOptions } from '@tanstack/react-query';

type LogoutMutationOptions = MutationOptions;

export const logoutMutationOptions = (options: LogoutMutationOptions = {}) =>
	mutationOptions({
		...options,
		mutationKey: ['logout'],
		mutationFn: auth.logout,
	});
