import { RedirectType, redirect } from 'next/navigation';

function UnauthenticatedLayout({ returnTo }: { returnTo?: string }) {
	const loginUrl = returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : '/login';
	return redirect(loginUrl, RedirectType.replace);
}

export { UnauthenticatedLayout };
