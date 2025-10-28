import { SidebarProvider } from '@dpm-core/shared';

import { AppSidebar } from '@/components/app-sidebar';
import { AuthProvider } from '@/providers/auth-provider';

const AuthLayout = async ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<AuthProvider>
			<SidebarProvider>
				<AppSidebar />
				{children}
			</SidebarProvider>
		</AuthProvider>
	);
};

export default AuthLayout;
