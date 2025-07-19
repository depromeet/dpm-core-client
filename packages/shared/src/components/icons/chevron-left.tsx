import { type ComponentPropsWithoutRef, forwardRef } from 'react';

const ChevronLeft = forwardRef<SVGSVGElement, ComponentPropsWithoutRef<'svg'>>((props, ref) => {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
			ref={ref}
		>
			<title>chevron-left</title>
			<path
				d="M15.5635 2.96284C15.915 2.61134 16.4847 2.61134 16.8362 2.96284C17.1876 3.31434 17.1876 3.88409 16.8362 4.23559L9.07249 11.9998L16.8362 19.764L16.8983 19.832C17.1866 20.1855 17.1657 20.7072 16.8362 21.0367C16.5066 21.3663 15.985 21.3873 15.6315 21.0989L15.5635 21.0367L7.16351 12.6362C6.81203 12.2847 6.81203 11.7149 7.16351 11.3634L15.5635 2.96284Z"
				fill="#9CA3AF"
			/>
		</svg>
	);
});

ChevronLeft.displayName = 'ChevronLeft';

export { ChevronLeft };
