import { type ComponentPropsWithoutRef, forwardRef } from 'react';

import type { IconProps } from './type';

const SubmitCompleted = forwardRef<SVGSVGElement, ComponentPropsWithoutRef<'svg'> & IconProps>(
	(props, ref) => {
		const { size = 20, color = '#5E83FE' } = props;
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
				<title>제출 완료</title>
				<path
					d="M10 2.00293C14.4183 2.00293 17.9999 5.58467 18 10.0029C18 14.4213 14.4183 18.0029 10 18.0029C5.58174 18.0028 2 14.4212 2 10.0029C2.0001 5.58473 5.5818 2.00303 10 2.00293ZM13.1396 7.39258C12.8308 7.05796 12.3294 7.05796 12.0205 7.39258L8.88867 10.7852L7.86621 9.67773C7.55735 9.34321 7.0569 9.3432 6.74805 9.67773C6.43917 10.0124 6.43917 10.555 6.74805 10.8896L8.33008 12.6035C8.63891 12.9377 9.13947 12.9378 9.44824 12.6035L13.1396 8.60449C13.4483 8.26989 13.4484 7.72713 13.1396 7.39258Z"
					fill={color}
				/>
			</svg>
		);
	},
);

SubmitCompleted.displayName = 'SubmitCompleted';

export { SubmitCompleted };
