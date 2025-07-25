import { member } from '@dpm-core/api';
import { type MutationOptions, mutationOptions } from '@tanstack/react-query';

type WithdrawMutationOptions = MutationOptions;

export const withdrawMutationOptions = (options: WithdrawMutationOptions) =>
	mutationOptions({
		mutationKey: ['withdraw'],
		mutationFn: async () => {
			await member.withdraw();
			return true;
		},
		...options,
	});
