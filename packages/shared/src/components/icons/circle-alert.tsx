import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import type { IconProps } from './type';

const CircleAlert = forwardRef<SVGSVGElement, ComponentPropsWithoutRef<'svg'> & IconProps>(
	(props, ref) => {
		const { size = 24, color = '#FF7070' } = props;
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill="none"
				ref={ref}
				{...props}
			>
				<title>circle-alert</title>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M20 12.0052C20 16.4235 16.4183 20.0052 12 20.0052C7.58172 20.0052 4 16.4235 4 12.0052C4 7.58697 7.58172 4.00525 12 4.00525C16.4183 4.00525 20 7.58697 20 12.0052ZM11.25 15.0052C11.25 14.591 11.5858 14.2552 12 14.2552C12.4142 14.2552 12.75 14.591 12.75 15.0052C12.75 15.4195 12.4142 15.7552 12 15.7552C11.5858 15.7552 11.25 15.4195 11.25 15.0052ZM12 13.2452C11.5858 13.2452 11.25 12.9095 11.25 12.4952L11.25 8.99524C11.25 8.58103 11.5858 8.24524 12 8.24524C12.4142 8.24524 12.75 8.58103 12.75 8.99524V12.4952C12.75 12.9095 12.4142 13.2452 12 13.2452Z"
					fill={color}
				/>
			</svg>
		);
	},
);

CircleAlert.displayName = 'CircleAlert';

export { CircleAlert };
