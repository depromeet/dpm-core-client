import type { SVGProps } from 'react';

export const UndoIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			aria-label="Undo"
			{...props}
		>
			<title>Undo</title>
			<path
				d="M2 4.66833V8.66834H6"
				stroke="currentColor"
				strokeWidth="1.2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M14 11.3351C14 9.74378 13.3679 8.21766 12.2426 7.09244C11.1174 5.96722 9.5913 5.33508 8 5.33508C6.52341 5.33659 5.09924 5.88252 4 6.86842L2 8.66842"
				stroke="currentColor"
				strokeWidth="1.2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};
