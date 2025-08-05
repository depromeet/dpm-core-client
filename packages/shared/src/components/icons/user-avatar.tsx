import { type ComponentPropsWithoutRef, forwardRef } from 'react';

const UserAvatar = forwardRef<SVGSVGElement, ComponentPropsWithoutRef<'svg'>>((props, ref) => {
	return (
		<svg
			width="32"
			height="32"
			viewBox="0 0 32 32"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			ref={ref}
			{...props}
		>
			<title>userAvatar</title>
			<g clip-path="url(#clip0_2839_3758)">
				<rect x="4" y="4" width="24" height="24" rx="12" fill="#F3F4F6" />
				<g clip-path="url(#clip1_2839_3758)">
					<path
						d="M15.7318 16.4586C17.7151 16.4586 19.3229 14.8508 19.3229 12.8675C19.3229 10.8842 17.7151 9.27637 15.7318 9.27637C13.7484 9.27637 12.1406 10.8842 12.1406 12.8675C12.1406 14.8508 13.7484 16.4586 15.7318 16.4586Z"
						fill="#9CA3AF"
						stroke="#9CA3AF"
						stroke-width="1.59606"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M23.4478 25.9347C23.4478 27.3895 22.5168 27.8977 15.9995 27.8977C9.4823 27.8977 8.55127 27.3895 8.55127 25.9347C8.55127 24.4799 9.336 23.0847 10.7328 22.0561C12.1296 21.0274 14.0241 20.4495 15.9995 20.4495C17.975 20.4495 19.8694 21.0274 21.2663 22.0561C22.6631 23.0847 23.4478 24.4799 23.4478 25.9347Z"
						fill="#9CA3AF"
						stroke="#9CA3AF"
						stroke-width="1.59606"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</g>
			</g>
			<defs>
				<clipPath id="clip0_2839_3758">
					<rect x="4" y="4" width="24" height="24" rx="12" fill="white" />
				</clipPath>
				<clipPath id="clip1_2839_3758">
					<rect
						width="22.3448"
						height="22.3448"
						fill="white"
						transform="translate(4.82715 6.48267)"
					/>
				</clipPath>
			</defs>
		</svg>
	);
});

export { UserAvatar };
