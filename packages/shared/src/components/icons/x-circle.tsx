import { forwardRef } from 'react';

const XCircle = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => {
	return (
		<svg
			width="28"
			height="28"
			viewBox="0 0 28 28"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			ref={ref}
			{...props}
		>
			<title>Close</title>
			<rect width="28" height="27.9989" rx="13.9994" fill="#F3F4F6" />
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M18.2245 9.37593C18.4588 9.61025 18.4588 9.99014 18.2245 10.2245L10.2245 18.2245C9.99014 18.4588 9.61025 18.4588 9.37593 18.2245C9.14162 17.9901 9.14162 17.6102 9.37593 17.3759L17.3759 9.37593C17.6102 9.14162 17.9901 9.14162 18.2245 9.37593Z"
				fill="#6B7280"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M9.37593 9.37593C9.61025 9.14162 9.99014 9.14162 10.2245 9.37593L18.2245 17.3759C18.4588 17.6102 18.4588 17.9901 18.2245 18.2245C17.9901 18.4588 17.6102 18.4588 17.3759 18.2245L9.37593 10.2245C9.14162 9.99014 9.14162 9.61025 9.37593 9.37593Z"
				fill="#6B7280"
			/>
		</svg>
	);
});

XCircle.displayName = 'XCircle';

export { XCircle };
