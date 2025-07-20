import SettleHeader from '@/components/settle/layout/SettleHeader';

const SettleLayout = async ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<SettleHeader />
			{children}
		</>
	);
};

export default SettleLayout;
