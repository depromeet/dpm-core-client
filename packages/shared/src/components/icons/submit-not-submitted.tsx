import { type ComponentPropsWithoutRef, forwardRef } from 'react';

import type { IconProps } from './type';

const SubmitNotSubmitted = forwardRef<SVGSVGElement, ComponentPropsWithoutRef<'svg'> & IconProps>(
	(props, ref) => {
		const { size = 20, color = '#FF7070' } = props;
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={size}
				height={size}
				viewBox="0 0 20 20"
				fill="none"
				ref={ref}
				{...props}
			>
				<title>미제출</title>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M10 2.00146C5.58172 2.00146 2 5.58319 2 10.0015C2 14.4197 5.58172 18.0015 10 18.0015C14.4183 18.0015 18 14.4197 18 10.0015C18 5.58319 14.4183 2.00146 10 2.00146ZM8.78033 7.72114C8.48744 7.42824 8.01256 7.42824 7.71967 7.72114C7.42678 8.01403 7.42678 8.4889 7.71967 8.78179L8.93934 10.0015L7.71967 11.2211C7.42678 11.514 7.42678 11.9889 7.71967 12.2818C8.01256 12.5747 8.48744 12.5747 8.78033 12.2818L10 11.0621L11.2197 12.2818C11.5126 12.5747 11.9874 12.5747 12.2803 12.2818C12.5732 11.9889 12.5732 11.514 12.2803 11.2211L11.0607 10.0015L12.2803 8.78179C12.5732 8.4889 12.5732 8.01403 12.2803 7.72114C11.9874 7.42824 11.5126 7.42824 11.2197 7.72114L10 8.9408L8.78033 7.72114Z"
					fill={color}
				/>
			</svg>
		);
	},
);

SubmitNotSubmitted.displayName = 'SubmitNotSubmitted';

export { SubmitNotSubmitted };
