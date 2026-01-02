import { cookies } from 'next/headers';
import { RedirectType, redirect } from 'next/navigation';

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStore = await cookies();
	const refreshToken = cookieStore.get('refresh_token');

	if (refreshToken) {
		return redirect('/', RedirectType.replace);
	}

	return <>{children}</>;
}
