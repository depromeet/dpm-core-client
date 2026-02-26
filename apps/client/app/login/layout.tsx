import { cookies } from 'next/headers';
import { RedirectType, redirect } from 'next/navigation';
import { COOKIE_KEYS } from '@dpm-core/api';

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStore = await cookies();
	const refreshToken = cookieStore.get(COOKIE_KEYS.REFRESH_TOKEN);

	if (refreshToken) {
		return redirect('/', RedirectType.replace);
	}

	return <>{children}</>;
}
