import { RedirectType, redirect } from 'next/navigation';

function UnauthenticatedLayout() {
	return null;
	// return redirect('/login', RedirectType.replace);
}

export { UnauthenticatedLayout };
