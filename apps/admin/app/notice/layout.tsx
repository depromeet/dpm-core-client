import { SidebarProvider } from '@dpm-core/shared';

import { AppSidebar } from '@/components/app-sidebar';

export default function NoticeLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SidebarProvider>
			<AppSidebar />
			{children}
		</SidebarProvider>
	);
}
