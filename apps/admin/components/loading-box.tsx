'use client';

import { Loading } from './lotties/loading';

const LoadingBox = () => {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-y-3">
			<Loading />
		</div>
	);
};

export { LoadingBox };
