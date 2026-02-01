import type { SVGProps } from 'react';

export const UnorderIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			aria-label="Unordered List"
			{...props}
		>
			<title>Unordered List</title>
			<path
				d="M2 8.00183H2.00667"
				stroke="currentColor"
				strokeWidth="1.20008"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M2 12.0021H2.00667"
				stroke="currentColor"
				strokeWidth="1.20008"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M2 4.00146H2.00667"
				stroke="currentColor"
				strokeWidth="1.20008"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M5.33398 8.00183H14.0013"
				stroke="currentColor"
				strokeWidth="1.20008"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M5.33398 12.0021H14.0013"
				stroke="currentColor"
				strokeWidth="1.20008"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M5.33398 4.00146H14.0013"
				stroke="currentColor"
				strokeWidth="1.20008"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};
