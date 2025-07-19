'use client';

import Lottie from 'react-lottie';
import LoadingJson from '../../assets/lotties/loading.json';

const Loading = () => {
	return (
		<Lottie
			options={{
				animationData: LoadingJson,
				loop: true,
			}}
		/>
	);
};

export { Loading };
