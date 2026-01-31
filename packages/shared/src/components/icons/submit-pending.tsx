import { type ComponentPropsWithoutRef, forwardRef } from 'react';

import type { IconProps } from './type';

const SubmitPending = forwardRef<SVGSVGElement, ComponentPropsWithoutRef<'svg'> & IconProps>(
	(props, ref) => {
		const { size = 20, color = '#9CA3AF' } = props;
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
				<title>확인 전</title>
				<path
					d="M10 2.00732C14.4183 2.00732 18 5.58905 18 10.0073C18 14.4256 14.4183 18.0073 10 18.0073C5.58172 18.0073 2 14.4256 2 10.0073C2 5.58905 5.58172 2.00732 10 2.00732ZM10 8.86475C9.36882 8.86475 8.85742 9.37614 8.85742 10.0073C8.85742 10.6385 9.36882 11.1499 10 11.1499C10.6312 11.1499 11.1426 10.6385 11.1426 10.0073C11.1426 9.37614 10.6312 8.86475 10 8.86475Z"
					fill={color}
				/>
			</svg>
		);
	},
);

SubmitPending.displayName = 'SubmitPending';

export { SubmitPending };
