import { forwardRef, useId } from 'react';

const Paperclip = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => {
	const clipId = useId();

	return (
		<svg
			width="12"
			height="12"
			viewBox="0 0 12 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			ref={ref}
			{...props}
		>
			<title>첨부</title>
			<g clipPath={`url(#${clipId})`}>
				<path
					d="M10.7201 5.52496L6.12514 10.12C5.56222 10.6829 4.79874 10.9991 4.00265 10.9991C3.20655 10.9991 2.44307 10.6829 1.88014 10.12C1.31722 9.55704 1.00098 8.79355 1.00098 7.99746C1.00098 7.20137 1.31722 6.43788 1.88014 5.87496L6.47514 1.27996C6.85043 0.904678 7.35942 0.693848 7.89014 0.693848C8.42087 0.693848 8.92986 0.904678 9.30515 1.27996C9.68043 1.65524 9.89126 2.16423 9.89126 2.69496C9.89126 3.22569 9.68043 3.73468 9.30515 4.10996L4.70514 8.70496C4.5175 8.8926 4.26301 8.99802 3.99764 8.99802C3.73228 8.99802 3.47779 8.8926 3.29014 8.70496C3.1025 8.51732 2.99709 8.26282 2.99709 7.99746C2.99709 7.7321 3.1025 7.4776 3.29014 7.28996L7.53514 3.04996"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
			<defs>
				<clipPath id={clipId}>
					<rect width="12" height="12" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
});

Paperclip.displayName = 'Paperclip';

export { Paperclip };
