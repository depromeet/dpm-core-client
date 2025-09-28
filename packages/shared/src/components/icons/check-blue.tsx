import { type ComponentPropsWithoutRef, forwardRef } from 'react';

const CheckBlue = forwardRef<SVGSVGElement, ComponentPropsWithoutRef<'svg'>>((props, ref) => {
	return (
		<svg
			width="17"
			height="16"
			viewBox="0 0 17 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			ref={ref}
			{...props}
		>
			<title>checkBlue</title>
			<path
				d="M8.5 1.60352C12.0347 1.60352 14.9004 4.46923 14.9004 8.00391C14.9002 11.5384 12.0345 14.4033 8.5 14.4033C4.96553 14.4032 2.09985 11.5383 2.09961 8.00391C2.09961 4.46927 4.96538 1.60359 8.5 1.60352ZM11.0117 5.91504C10.7646 5.64735 10.3633 5.64735 10.1162 5.91504L7.61133 8.62891L6.79297 7.74316C6.54588 7.47554 6.14553 7.47554 5.89844 7.74316C5.65134 8.01086 5.65134 8.4452 5.89844 8.71289L7.16406 10.083C7.41116 10.3507 7.81149 10.3507 8.05859 10.083L11.0117 6.88477C11.2587 6.61709 11.2587 6.18271 11.0117 5.91504Z"
				fill="#5E83FE"
			/>
		</svg>
	);
});

CheckBlue.displayName = 'CheckBlue';

export { CheckBlue };
