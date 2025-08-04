import { AppLayout } from '@dpm-core/shared';
import { AppHeader } from '@/components/app-header';

const SettleLayout = async ({ children }: { children: React.ReactNode }) => {
	return (
		<AppLayout className="bg-background-normal ">
			<AppHeader title="정산" backHref="/" className="mb-1.5" />
			{children}
		</AppLayout>
	);
};

export default SettleLayout;
