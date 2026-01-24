import type { PropsWithChildren } from 'react';

// import { AuthProvider } from '@/providers/auth-provider';

const StaffTogetherLayout = async (props: PropsWithChildren) => {
	// return <AuthProvider>{props.children}</AuthProvider>;
	return <>{props.children}</>;
};

export default StaffTogetherLayout;
