import { SidebarProvider } from '@dpm-core/shared';

import { AppSidebar } from '@/components/app-sidebar';
import { AdminClarityAdapter } from '@/providers/admin-clarity-adapter';
import { AuthProvider } from '@/providers/auth-provider';

const CLARITY_PROJECT_ID = 'yay9jp3p28';

export default async function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<AuthProvider>
			<AdminClarityAdapter projectId={CLARITY_PROJECT_ID}>
				<SidebarProvider>
					<AppSidebar />
					{children}
				</SidebarProvider>
			</AdminClarityAdapter>
		</AuthProvider>
	);
}
