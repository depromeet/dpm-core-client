'use client';

import { auth } from '@dpm-core/api';
import { useQuery } from '@tanstack/react-query';

const AuthPage = () => {
	const { data } = useQuery({
		queryKey: ['auth'],
		queryFn: auth.reissue,
	});

	console.log(data);

	return <div>AuthPage</div>;
};

export default AuthPage;
