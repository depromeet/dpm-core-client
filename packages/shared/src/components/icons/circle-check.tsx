import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import type { IconProps } from './type';

const CircleCheck = forwardRef<SVGSVGElement, ComponentPropsWithoutRef<'svg'> & IconProps>(
	(props, ref) => {
		const { size = 32, color = '#5E83FE' } = props;
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={size}
				height={size}
				viewBox="0 0 32 32"
				fill="none"
				ref={ref}
				{...props}
			>
				<title>circle-check</title>
				<path
					d="M16.5029 5.33398C22.3938 5.33416 27.1689 10.11 27.1689 16.001C27.1688 21.8918 22.3937 26.6668 16.5029 26.667C10.612 26.667 5.83611 21.8919 5.83594 16.001C5.83594 10.1099 10.6119 5.33398 16.5029 5.33398ZM20.5459 13.293C20.1554 12.9025 19.5224 12.9026 19.1318 13.293L15.1719 17.2529L13.8789 15.96C13.4884 15.5694 12.8554 15.5694 12.4648 15.96C12.0745 16.3505 12.0744 16.9836 12.4648 17.374L14.4648 19.374C14.8553 19.7643 15.4884 19.7643 15.8789 19.374L20.5459 14.707C20.9362 14.3165 20.9362 13.6835 20.5459 13.293Z"
					fill={color}
				/>
			</svg>
		);
	},
);

CircleCheck.displayName = 'CircleCheck';

export { CircleCheck };
