import { type ExternalToast, toast as toastify } from 'sonner';
import { CheckIcon, CircleAlert } from '../icons';

interface ToastProps {
	toastId: string | number;
	message?: string;
}

const Toast = ({ toastId, message }: ToastProps) => {
	return (
		<div className="flex items-center py-3 px-4 rounded-full bg-gray-800/90 w-fit mx-auto gap-x-2 pointer-events-none select-none">
			<CheckIcon
				className="size-6 bg-blue-300 flex items-center justify-center rounded-full"
				size={16}
			/>
			<p className="text-body2 font-medium text-neutral-5">{message}</p>
		</div>
	);
};

const ErrorToast = ({ toastId, message }: ToastProps) => {
	return (
		<div className="flex items-center py-3 px-4 rounded-full bg-gray-800/90 w-fit mx-auto gap-x-2 pointer-events-none select-none">
			<CircleAlert />
			<p className="text-body2 font-medium text-neutral-5">{message}</p>
		</div>
	);
};

const toast = {
	success: (message: string, options?: ExternalToast) => {
		toastify.custom((id) => <Toast toastId={id} message={message} />, options);
	},
	error: (message: string, options?: ExternalToast) => {
		toastify.custom((id) => <ErrorToast toastId={id} message={message} />, options);
	},
};

export { Toast, toast };
