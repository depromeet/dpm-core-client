import DetailStep from './DetailStep';

const DetailBottom = () => {
	return (
		<div>
			<h2 className="px-4 py-2 text-gray-900 font-semibold text-title2">회식 참석 현황</h2>
			<ul className="flex flex-col">
				{[1, 2, 3, 4, 5].map((item) => (
					<DetailStep key={item} />
				))}
			</ul>
		</div>
	);
};

export default DetailBottom;
