import { type ExternalToast, toast as toastify } from 'sonner';

import { CheckIcon, CircleAlert } from '../icons';

interface ToastProps {
	message?: string;
}

const Toast = ({ message }: ToastProps) => {
	return (
		<div className="pointer-events-none mx-auto flex w-fit select-none items-center gap-x-2 rounded-full bg-gray-800/90 px-4 py-3">
			<CheckIcon
				className="flex size-6 items-center justify-center rounded-full bg-blue-300"
				size={16}
			/>
			<p className="font-medium text-body2 text-neutral-5">{message}</p>
		</div>
	);
};

const ErrorToast = ({ message }: ToastProps) => {
	return (
		<div className="pointer-events-none mx-auto flex w-fit select-none items-center gap-x-2 rounded-full bg-gray-800/90 px-4 py-3">
			<CircleAlert />
			<p className="font-medium text-body2 text-neutral-5">{message}</p>
		</div>
	);
};

const InfoToast = ({ message }: ToastProps) => {
	return (
		<div className="pointer-events-none mx-auto flex w-fit select-none items-center gap-x-2 rounded-full bg-gray-800/90 px-4 py-3">
			<p className="font-medium text-body2 text-neutral-5">{message}</p>
		</div>
	);
};

const toast = {
	success: (message: string, options?: ExternalToast) => {
		toastify.custom((_) => <Toast message={message} />, options);
	},
	error: (message: string, options?: ExternalToast) => {
		toastify.custom((_) => <ErrorToast message={message} />, options);
	},
	info: (message: string, options?: ExternalToast) => {
		toastify.custom((_) => <InfoToast message={message} />, options);
	},
};

export { Toast, toast };
