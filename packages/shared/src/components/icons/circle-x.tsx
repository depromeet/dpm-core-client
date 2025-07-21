import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import type { IconProps } from './type';

const CircleX = forwardRef<SVGSVGElement, ComponentPropsWithoutRef<'svg'> & IconProps>(
	(props, ref) => {
		const { size = 16, color = '#FF7070' } = props;
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
				<title>circle-x</title>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M8.0001 1.60173C4.46547 1.60173 1.6001 4.46711 1.6001 8.00173C1.6001 11.5364 4.46547 14.4017 8.0001 14.4017C11.5347 14.4017 14.4001 11.5364 14.4001 8.00173C14.4001 4.46711 11.5347 1.60173 8.0001 1.60173ZM7.02436 6.17747C6.79005 5.94315 6.41015 5.94315 6.17583 6.17747C5.94152 6.41178 5.94152 6.79168 6.17583 7.02599L7.15157 8.00173L6.17583 8.97747C5.94152 9.21178 5.94152 9.59168 6.17583 9.82599C6.41015 10.0603 6.79005 10.0603 7.02436 9.82599L8.0001 8.85026L8.97583 9.82599C9.21015 10.0603 9.59005 10.0603 9.82436 9.82599C10.0587 9.59168 10.0587 9.21178 9.82436 8.97747L8.84863 8.00173L9.82436 7.02599C10.0587 6.79168 10.0587 6.41178 9.82436 6.17747C9.59005 5.94315 9.21015 5.94315 8.97583 6.17747L8.0001 7.1532L7.02436 6.17747Z"
					fill={color}
				/>
			</svg>
		);
	},
);

CircleX.displayName = 'CircleX';

export { CircleX };
