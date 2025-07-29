import SettleList from '../main/SettleList';

export default function MainTemplete() {
	// if (!settleList || settleList.length === 0) return <NoSettle />;
	// console.log('settleList', settleList);
	return <SettleList settleList={settleList} />;
}
