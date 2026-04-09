import { mutationOptions } from '@tanstack/react-query';
import { notification } from '@dpm-core/api';

export const registerPushTokenMutationOptions = () =>
	mutationOptions({
		mutationKey: ['push-token', 'register'],
		mutationFn: (token: string) => notification.registerPushToken({ token }),
	});
