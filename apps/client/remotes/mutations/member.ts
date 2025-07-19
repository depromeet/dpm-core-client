import { member } from '@dpm-core/api';
import { type MutationOptions, mutationOptions } from '@tanstack/react-query';

type WithdrawMutationOptions = MutationOptions;

export const withdrawMutationOptions = (options: WithdrawMutationOptions) =>
	mutationOptions({
		...options,
		mutationFn: () => {
			return member.withdraw();
		},
	});
