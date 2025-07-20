import DetailStateHeader from '@/components/settle/detail/DetailStateHeader';

const SettleDetailStateLayout = async ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<DetailStateHeader />
			{children}
		</>
	);
};

export default SettleDetailStateLayout;
