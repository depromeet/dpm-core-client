import type { PropsWithChildren } from 'react';
import { AuthProvider } from '@/providers/auth-provider';

const AuthLayout = async (props: PropsWithChildren) => {
	return <AuthProvider>{props.children}</AuthProvider>;
};

export default AuthLayout;
