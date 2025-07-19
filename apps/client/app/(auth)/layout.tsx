import type { PropsWithChildren } from 'react';
import { AuthProvider } from '@/providers/auth-provider';

const AuthLayout = async ({ children }: PropsWithChildren) => {
	return <AuthProvider>{children}</AuthProvider>;
};

export default AuthLayout;
