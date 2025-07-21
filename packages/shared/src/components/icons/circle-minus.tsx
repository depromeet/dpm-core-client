import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import type { IconProps } from './type';

const CircleMinus = forwardRef<SVGSVGElement, ComponentPropsWithoutRef<'svg'> & IconProps>(
	(props, ref) => {
		const { size = 16, color = '#FFC06E' } = props;
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
				<title>circle-minus</title>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M8.0001 1.60522C4.46547 1.60522 1.6001 4.4706 1.6001 8.00522C1.6001 11.5398 4.46547 14.4052 8.0001 14.4052C11.5347 14.4052 14.4001 11.5398 14.4001 8.00522C14.4001 4.4706 11.5347 1.60522 8.0001 1.60522ZM5.4001 8.00522C5.4001 7.67385 5.66873 7.40522 6.0001 7.40522H10.0001C10.3315 7.40522 10.6001 7.67385 10.6001 8.00522C10.6001 8.3366 10.3315 8.60522 10.0001 8.60522H6.0001C5.66873 8.60522 5.4001 8.3366 5.4001 8.00522Z"
					fill={color}
				/>
			</svg>
		);
	},
);

CircleMinus.displayName = 'CircleMinus';

export { CircleMinus };
