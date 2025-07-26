import AttendHeader from '@/components/settlement/layout/AttendHeader';

const SettlementLayout = async ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="max-w-lg mx-auto">
			<AttendHeader />
			{children}
		</div>
	);
};

export default SettlementLayout;
