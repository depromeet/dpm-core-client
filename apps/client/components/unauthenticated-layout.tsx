import { RedirectType, redirect } from 'next/navigation';

function UnauthenticatedLayout() {
	return redirect('/login', RedirectType.replace);
}

export { UnauthenticatedLayout };
