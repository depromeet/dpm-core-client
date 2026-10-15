import type { PropsWithChildren } from 'react';

import { AuthProvider } from '@/providers/auth-provider';

const HomeLayout = ({ children }: PropsWithChildren) => {
	return <AuthProvider>{children}</AuthProvider>;
};

export default HomeLayout;
