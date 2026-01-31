import type { SVGProps } from 'react';

export const OrderIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			{...props}
		>
			<path
				d="M6.66797 8.00183H14.0018"
				stroke="currentColor"
				strokeWidth="1.20008"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M6.66797 12.0021H14.0018"
				stroke="currentColor"
				strokeWidth="1.20008"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M6.66797 4.00146H14.0018"
				stroke="currentColor"
				strokeWidth="1.20008"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M2.66602 6.66833H3.99944"
				stroke="currentColor"
				strokeWidth="1.20008"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M2.66602 4.00146H3.33273V6.66832"
				stroke="currentColor"
				strokeWidth="1.20008"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M3.99944 12.0021H2.66602C2.66602 11.3354 3.99944 10.6687 3.99944 10.002C3.99944 9.33525 3.33273 9.00189 2.66602 9.33525"
				stroke="currentColor"
				strokeWidth="1.20008"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};
