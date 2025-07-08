import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { PropsWithChildren } from 'react';

const AuthLayout = async (props: PropsWithChildren) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return redirect('/login');
	}
};

export default AuthLayout;
