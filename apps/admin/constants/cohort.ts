import type { StaticImageData } from 'next/image';
import type { Part } from '@dpm-core/api';

import ANDROID from '@/assets/icons/aos.webp';
import DESIGN from '@/assets/icons/design.webp';
import IOS from '@/assets/icons/ios.webp';
import SERVER from '@/assets/icons/server.webp';
import WEB from '@/assets/icons/web.webp';

const cohort: Record<Exclude<Part, 'ETC'>, StaticImageData> = {
	WEB,
	ANDROID,
	IOS,
	DESIGN,
	SERVER,
};

export { cohort };
