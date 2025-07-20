import CreateSettleBtn from '@/components/settle/layout/CreateSettleBtn';
import MainTemplete from '@/components/settle/templates/MainTemplete';

export default function SettleMainPage() {
	return (
		<div className="relative min-h-screen pt-24 ">
			<MainTemplete />
			<CreateSettleBtn />
		</div>
	);
}
