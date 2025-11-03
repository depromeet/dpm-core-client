'use client';

import { Loading } from './lotties/loading';

const LoadingBox = () => {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-y-3">
			<div className="max-h-[800px] max-w-[800px]">
				<Loading />
			</div>
		</div>
	);
};

export { LoadingBox };
