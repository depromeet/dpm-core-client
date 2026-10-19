import { type ComponentPropsWithoutRef, forwardRef } from 'react';

const Megaphone = forwardRef<SVGSVGElement, ComponentPropsWithoutRef<'svg'>>((props, ref) => {
	return (
		<svg
			ref={ref}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<title>공지</title>
			<path
				d="M6.8818 16.4075H2.9848C2.3302 16.4075 1.7998 15.8771 1.7998 15.2225V8.77728C1.7998 8.12268 2.3302 7.59229 2.9848 7.59229H6.8818V16.4075Z"
				fill="#3656FB"
			/>
			<path
				d="M6.88184 16.4076V7.59235L17.9662 2.33635C18.7522 1.96375 19.6588 2.53675 19.6588 3.40735V20.5932C19.6588 21.4632 18.7522 22.0368 17.9662 21.6642L6.88184 16.4076Z"
				fill="#5E83FE"
			/>
			<path
				d="M19.6592 9.7959H21.0152C21.6698 9.7959 22.2002 10.3263 22.2002 10.9809V13.0185C22.2002 13.6731 21.6698 14.2035 21.0152 14.2035H19.6592"
				fill="#3656FB"
			/>
		</svg>
	);
});

Megaphone.displayName = 'Megaphone';

export { Megaphone };
