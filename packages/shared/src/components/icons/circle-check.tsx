import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import type { IconProps } from './type';

const CircleCheck = forwardRef<SVGSVGElement, ComponentPropsWithoutRef<'svg'> & IconProps>(
	(props, ref) => {
		const { size = 16, color = '#5E83FE' } = props;
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={size}
				height={size}
				viewBox="0 0 16 16"
				fill="none"
				ref={ref}
				{...props}
			>
				<title>circle-check</title>
				<path
					d="M8 2.1C11.5 2.1 14.4 5 14.4 8.5C14.4 12 11.5 14.9 8 14.9C4.5 14.9 1.6 12 1.6 8.5C1.6 5 4.5 2.1 8 2.1ZM10.5 6.4C10.3 6.1 9.9 6.1 9.6 6.4L7.1 9.1L6.3 8.2C6.1 8 5.6 8 5.4 8.2C5.2 8.5 5.2 8.9 5.4 9.2L6.7 10.6C6.9 10.9 7.3 10.9 7.6 10.6L10.5 7.4C10.8 7.1 10.8 6.7 10.5 6.4Z"
					fill={color}
				/>
			</svg>
		);
	},
);

CircleCheck.displayName = 'CircleCheck';

export { CircleCheck };
