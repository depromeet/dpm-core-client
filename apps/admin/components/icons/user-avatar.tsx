import { type ComponentPropsWithoutRef, forwardRef } from 'react';

const UserAvatar = forwardRef<SVGSVGElement, ComponentPropsWithoutRef<'svg'>>((props, ref) => {
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
			<title>Dpmcore(Logo)</title>
			<g clipPath="url(#clip0_1250_4198)">
				<rect width="24" height="24" rx="12" fill="#F3F4F6" />
				<g clipPath="url(#clip1_1250_4198)">
					<path
						d="M11.7318 12.4591C13.7151 12.4591 15.3229 10.8513 15.3229 8.86799C15.3229 6.88466 13.7151 5.27686 11.7318 5.27686C9.74843 5.27686 8.14062 6.88466 8.14062 8.86799C8.14062 10.8513 9.74843 12.4591 11.7318 12.4591Z"
						fill="#9CA3AF"
						stroke="#9CA3AF"
						strokeWidth="1.59606"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M19.4483 21.9349C19.4483 23.3897 18.5173 23.898 12 23.898C5.48279 23.898 4.55176 23.3897 4.55176 21.9349C4.55176 20.4802 5.33648 19.085 6.73331 18.0563C8.13013 17.0276 10.0246 16.4497 12 16.4497C13.9754 16.4497 15.8699 17.0276 17.2668 18.0563C18.6636 19.085 19.4483 20.4802 19.4483 21.9349Z"
						fill="#9CA3AF"
						stroke="#9CA3AF"
						strokeWidth="1.59606"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</g>
			</g>
			<defs>
				<clipPath id="clip0_1250_4198">
					<rect width="24" height="24" rx="12" fill="white" />
				</clipPath>
				<clipPath id="clip1_1250_4198">
					<rect
						width="22.3448"
						height="22.3448"
						fill="white"
						transform="translate(0.827148 2.48291)"
					/>
				</clipPath>
			</defs>
		</svg>
	);
});

export { UserAvatar };
