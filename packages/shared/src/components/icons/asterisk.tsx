import { type ComponentPropsWithoutRef, forwardRef } from 'react';

const Aesterisk = forwardRef<SVGSVGElement, ComponentPropsWithoutRef<'svg'>>((props, ref) => {
	return (
		<svg
			width="57"
			height="57"
			viewBox="0 0 57 57"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			ref={ref}
			{...props}
		>
			<title>별표</title>
			<path
				d="M28.5 12.75V44.25M39.6369 17.3631L17.3631 39.6369M39.6369 39.6371L17.3631 17.3632M44.25 28.5001L12.75 28.5001"
				stroke="#E5E7EB"
				strokeWidth="3.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
});

Aesterisk.displayName = 'Aesterisk';

export { Aesterisk };
