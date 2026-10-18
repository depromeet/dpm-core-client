import { cn, toast as sharedToast } from '@dpm-core/shared';

type ToastOptions = NonNullable<Parameters<typeof sharedToast.success>[1]>;

const desktopOptions = (options?: ToastOptions): ToastOptions => ({
	...options,
	className: cn('[&>div]:px-5 [&_p]:font-semibold [&_p]:text-body1', options?.className),
});

export const toast = {
	success: (message: string, options?: ToastOptions) =>
		sharedToast.success(message, desktopOptions(options)),
	error: (message: string, options?: ToastOptions) =>
		sharedToast.error(message, desktopOptions(options)),
	info: (message: string, options?: ToastOptions) =>
		sharedToast.info(message, desktopOptions(options)),
	light: (message: string, options?: ToastOptions) =>
		sharedToast.light(message, desktopOptions(options)),
};
