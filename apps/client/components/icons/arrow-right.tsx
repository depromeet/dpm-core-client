import { type ComponentPropsWithoutRef, forwardRef } from 'react';

const ArrowRight = forwardRef<SVGSVGElement, ComponentPropsWithoutRef<'svg'>>((props, ref) => {
	return (
		<svg
			ref={ref}
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<title>오른쪽 화살표</title>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3.41699 10C3.41699 9.58579 3.75278 9.25 4.16699 9.25H15.8337C16.2479 9.25 16.5837 9.58579 16.5837 10C16.5837 10.4142 16.2479 10.75 15.8337 10.75H4.16699C3.75278 10.75 3.41699 10.4142 3.41699 10Z"
				fill="white"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M9.46967 3.63666C9.76256 3.34377 10.2374 3.34377 10.5303 3.63666L16.3637 9.47C16.6566 9.76289 16.6566 10.2378 16.3637 10.5307L10.5303 16.364C10.2374 16.6569 9.76256 16.6569 9.46967 16.364C9.17678 16.0711 9.17678 15.5962 9.46967 15.3033L14.7727 10.0003L9.46967 4.69732C9.17678 4.40443 9.17678 3.92956 9.46967 3.63666Z"
				fill="white"
			/>
		</svg>
	);
});

ArrowRight.displayName = 'ArrowRight';

export { ArrowRight };
