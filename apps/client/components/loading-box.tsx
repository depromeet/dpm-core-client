'use client';

import { Loading } from './lotties/loading';

const LoadingBox = () => {
	return (
		<div className="flex flex-col items-center justify-center gap-y-3 flex-1">
			<Loading />
		</div>
	);
};

export { LoadingBox };
