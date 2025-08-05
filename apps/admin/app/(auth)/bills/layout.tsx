import { AppLayout } from '@dpm-core/shared';

const BillsLayout = async ({ children }: { children: React.ReactNode }) => {
	return <AppLayout className="bg-background-normal">{children}</AppLayout>;
};

export default BillsLayout;
