import SettleListItem1 from './SettleListItem1';
import SettleListItem2 from './SettleListItem2';
import SettleListItem3 from './SettleListItem3';

const SettleList = () => {
	return (
		<ul className="flex flex-col">
			{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
				<SettleListItem1 key={item} />
			))}
			<SettleListItem2 />
			<SettleListItem3 />
		</ul>
	);
};

export default SettleList;
