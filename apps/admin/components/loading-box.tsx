'use client';

import { Loading } from './lotties/loading';

const LoadingBox = () => {
	return (
		<div className="flex flex-1 flex-col items-center justify-center">
			<div className="aspect-375/212 max-w-[375px]">
				<Loading />
			</div>
		</div>
	);
};

export { LoadingBox };
