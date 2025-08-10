import { forwardRef } from 'react';

const XIcon = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => {
	return (
		<svg
			width="15"
			height="15"
			viewBox="0 0 15 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			ref={ref}
			{...props}
		>
			<title>닫기</title>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M14.3362 1.0644C14.6877 1.4159 14.6877 1.98579 14.3362 2.33728L2.3362 14.3381C1.98473 14.6896 1.41488 14.6896 1.06341 14.3381C0.711937 13.9866 0.711937 13.4167 1.06341 13.0652L13.0634 1.0644C13.4149 0.712907 13.9847 0.712907 14.3362 1.0644Z"
				fill="currentColor"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M1.06341 1.0644C1.41488 0.712907 1.98473 0.712907 2.3362 1.0644L14.3362 13.0652C14.6877 13.4167 14.6877 13.9866 14.3362 14.3381C13.9847 14.6896 13.4149 14.6896 13.0634 14.3381L1.06341 2.33728C0.711937 1.98579 0.711937 1.4159 1.06341 1.0644Z"
				fill="currentColor"
			/>
		</svg>
	);
});

XIcon.displayName = 'XIcon';

export { XIcon };
