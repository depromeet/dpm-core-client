
interface FixedBottomBtnProps {
	title: string;
	onClick?: () => void;
}

const FixedBottomBtn = ({ title, onClick }: FixedBottomBtnProps) => {
	return (
		<button
			onClick={onClick}
			type="button"
			className="max-w-lg mx-auto fixed cursor-pointer z-10 bg-gray-800 bottom-0 left-0 right-0 w-full h-14 text-white text-body1 font-semibold"
		>
			{title}
		</button>
	);
};

export default FixedBottomBtn;
