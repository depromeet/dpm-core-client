import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import type { IconProps } from './type';

const ChevronDown = forwardRef<SVGSVGElement, ComponentPropsWithoutRef<'svg'> & IconProps>(
	(props, ref) => {
		const { size = 12, color = '#9CA3AF' } = props;
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={size}
				height={size}
				viewBox="0 0 12 12"
				fill="none"
				{...props}
				ref={ref}
			>
				<title>chevron-down</title>
				<path
					d="M10.7681 4.21825C10.9438 4.04251 10.9438 3.75765 10.7681 3.58192C10.5924 3.40618 10.3075 3.40618 10.1318 3.58192L6.24994 7.46375L2.3681 3.58192L2.33412 3.55086C2.15737 3.40668 1.89653 3.41716 1.73177 3.58192C1.56701 3.74668 1.55653 4.00751 1.70072 4.18426L1.73177 4.21825L5.93177 8.41825C6.10751 8.59398 6.39236 8.59398 6.5681 8.41825L10.7681 4.21825Z"
					fill={color}
				/>
			</svg>
		);
	},
);

ChevronDown.displayName = 'ChevronDown';

export { ChevronDown };
