import CreateSettleBtn from '@/components/settle/layout/CreateSettleBtn';
import MainTemplete from '@/components/settle/templates/MainTemplete';

export default async function SettleMainPage() {
	return (
		<div className="relative min-h-screen pt-[96px] ">
			<MainTemplete />
			<CreateSettleBtn />
		</div>
	);
}
