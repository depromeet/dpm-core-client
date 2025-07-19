'use client';

import type { PropsWithChildren } from 'react';
import { AuthProvider } from '@/providers/auth-provider';

const AuthLayout = ({ children }: PropsWithChildren) => {
	return <AuthProvider>{children}</AuthProvider>;
};

export default AuthLayout;
