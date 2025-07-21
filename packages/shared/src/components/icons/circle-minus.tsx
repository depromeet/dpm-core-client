import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import type { IconProps } from './type';

const CircleMinus = forwardRef<SVGSVGElement, ComponentPropsWithoutRef<'svg'> & IconProps>(
	(props, ref) => {
		const { size = 32, color = '#FFC06E' } = props;
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
				<title>circle-minus</title>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M15.9987 5.33398C10.1077 5.33398 5.33203 10.1096 5.33203 16.0007C5.33203 21.8917 10.1077 26.6673 15.9987 26.6673C21.8897 26.6673 26.6654 21.8917 26.6654 16.0007C26.6654 10.1096 21.8897 5.33398 15.9987 5.33398ZM11.6654 16.0007C11.6654 15.4484 12.1131 15.0007 12.6654 15.0007H19.332C19.8843 15.0007 20.332 15.4484 20.332 16.0007C20.332 16.5529 19.8843 17.0007 19.332 17.0007H12.6654C12.1131 17.0007 11.6654 16.5529 11.6654 16.0007Z"
					fill={color}
				/>
			</svg>
		);
	},
);

CircleMinus.displayName = 'CircleMinus';

export { CircleMinus };
