'use client';
import { ChevronRight } from '@dpm-core/shared';
import { motion } from 'motion/react';

const SessionBanner = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.5 }}
			className="py-3 px-4 bg-primary-normal flex items-center justify-between"
		>
			<p className="text-white">2주차 세션 출석 코드 : 0000</p>
			<ChevronRight className="text-white" />
		</motion.div>
	);
};

export { SessionBanner };
