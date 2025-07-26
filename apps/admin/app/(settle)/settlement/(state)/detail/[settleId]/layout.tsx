import DetailHeader from '@/components/settlement/layout/DetailHeader';

const SettlementLayout = async ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="max-w-lg mx-auto">
			<DetailHeader />
			{children}
		</div>
	);
};

export default SettlementLayout;
