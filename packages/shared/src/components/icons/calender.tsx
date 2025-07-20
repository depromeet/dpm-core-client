import { type ComponentPropsWithoutRef, forwardRef } from 'react';

const Calender = forwardRef<SVGSVGElement, ComponentPropsWithoutRef<'svg'>>((props, ref) => {
	return (
		<svg
			width="15"
			height="16"
			viewBox="0 0 15 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			ref={ref}
			{...props}
		>
			<title>Calender</title>
			<path
				d="M13.291 11.8838C13.2909 13.0997 12.2287 14.0194 11.0029 14.0195H3.66895C2.44321 14.0194 1.38102 13.0997 1.38086 11.8838V6.20508H13.291V11.8838ZM10.7734 1.63281C11.0247 1.63281 11.2285 1.83663 11.2285 2.08789V2.87012C12.3562 2.97486 13.2909 3.85634 13.291 4.99707V5.14258H1.38086V4.99707C1.38093 3.9009 2.24443 3.04679 3.3125 2.88867V2.08789C3.3125 1.83663 3.51632 1.63281 3.76758 1.63281C4.01879 1.63286 4.22266 1.83667 4.22266 2.08789V2.86035H10.3184V2.08789C10.3184 1.83663 10.5222 1.63281 10.7734 1.63281Z"
				fill="#9CA3AF"
			/>
		</svg>
	);
});

Calender.displayName = 'Calender';

export { Calender };
