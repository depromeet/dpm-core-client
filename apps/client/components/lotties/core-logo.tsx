'use client';

import Lottie from 'lottie-react';
import coreLogoLottieData from '@/assets/lotties/corelogo.json';

const CoreLogo = () => {
	return <Lottie animationData={coreLogoLottieData} loop={false} className="w-16 h-16" />;
};

export { CoreLogo };
