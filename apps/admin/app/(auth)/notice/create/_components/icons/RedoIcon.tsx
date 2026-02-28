import type { SVGProps } from 'react';

export const RedoIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			aria-label="Redo"
			{...props}
		>
			<title>Redo</title>
			<path
				d="M14 4.66833V8.66834H10"
				stroke="currentColor"
				strokeWidth="1.2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M2 11.3351C2 9.74378 2.63214 8.21766 3.75736 7.09244C4.88258 5.96722 6.4087 5.33508 8 5.33508C9.47659 5.33659 10.9008 5.88252 12 6.86842L14 8.66842"
				stroke="currentColor"
				strokeWidth="1.2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};
