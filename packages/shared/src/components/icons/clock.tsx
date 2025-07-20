import { type ComponentPropsWithoutRef, forwardRef } from 'react';

const Clock = forwardRef<SVGSVGElement, ComponentPropsWithoutRef<'svg'>>((props, ref) => {
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
			<title>Clock</title>
			<path
				d="M7.8125 1.75C11.2643 1.75 14.0625 4.54822 14.0625 8C14.0625 11.4518 11.2643 14.25 7.8125 14.25C4.36072 14.25 1.5625 11.4518 1.5625 8C1.5625 4.54822 4.36072 1.75 7.8125 1.75ZM7.8125 5.1377C7.46732 5.1377 7.1875 5.41752 7.1875 5.7627V8.70312C7.18765 8.972 7.36013 9.21086 7.61523 9.2959L9.72461 9.99902L9.84766 10.0264C10.1363 10.0612 10.4191 9.89007 10.5146 9.60352C10.6238 9.27605 10.4466 8.92165 10.1191 8.8125L8.4375 8.25195V5.7627C8.4375 5.41752 8.15768 5.1377 7.8125 5.1377Z"
				fill="#9CA3AF"
			/>
		</svg>
	);
});

Clock.displayName = 'Clock';

export { Clock };
