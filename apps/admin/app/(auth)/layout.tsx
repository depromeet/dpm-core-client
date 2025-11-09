import { SidebarProvider } from '@dpm-core/shared';

import { AppSidebar } from '@/components/app-sidebar';
import { AuthProvider } from '@/providers/auth-provider';

export default async function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<AuthProvider>
			<SidebarProvider>
				<AppSidebar />
				{children}
			</SidebarProvider>
		</AuthProvider>
	);
}
