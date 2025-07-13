import type { PropsWithChildren } from 'react';

const AuthLayout = async (props: PropsWithChildren) => {
	if (process.env.NODE_ENV === 'development') {
		return props.children;
	}

	// const session = await auth.api.getSession({
	// 	headers: await headers(),
	// });

	// if (!session) {
	// 	return redirect('/login');
	// }

	return props.children;
};

export default AuthLayout;
