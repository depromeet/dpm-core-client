import type { PropsWithChildren } from 'react';

// import { AuthProvider } from '@/providers/auth-provider';

const AfterPartyLayout = async (props: PropsWithChildren) => {
	// return <AuthProvider>{props.children}</AuthProvider>;
	return <>{props.children}</>;
};

export default AfterPartyLayout;
