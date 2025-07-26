import SettleHeader from '@/components/settle/layout/SettleHeader';

const SettleLayout = async ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='max-w-lg mx-auto'>
			<SettleHeader />
			{children}
		</div>
	);
};

export default SettleLayout;
