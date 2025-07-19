'use client';

interface ErrorBoxProps {
	onReset?: () => void;
}

const ErrorBox = (props: ErrorBoxProps) => {
	return (
		<div className="flex flex-col items-center justify-center h-full">
			<p className="text-body2 font-semibold">이런! 문제가 생겼어요.</p>
			<button type="button" onClick={props.onReset}>
				다시 시도
			</button>
		</div>
	);
};

export { ErrorBox };
