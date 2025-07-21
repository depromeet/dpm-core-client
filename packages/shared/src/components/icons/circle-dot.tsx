import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import type { IconProps } from './type';

const CircleDot = forwardRef<SVGSVGElement, ComponentPropsWithoutRef<'svg'> & IconProps>(
	(props, ref) => {
		const { size = 16, color = '#9CA3AF' } = props;
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
				<title>circle-dot</title>
				<path
					d="M8 1.60651C11.5346 1.60651 14.4004 4.47228 14.4004 8.0069C14.4001 11.5413 11.5345 14.4063 8 14.4063C4.46554 14.4063 1.59987 11.5413 1.59961 8.0069C1.59961 4.47228 4.46538 1.60651 8 1.60651ZM8 7.09187C7.49505 7.09187 7.08594 7.50196 7.08594 8.0069C7.0862 8.51163 7.49522 8.92097 8 8.92097C8.50478 8.92097 8.9138 8.51163 8.91406 8.0069C8.91406 7.50196 8.50495 7.09187 8 7.09187Z"
					fill={color}
				/>
			</svg>
		);
	},
);

CircleDot.displayName = 'CircleDot';

export { CircleDot };
