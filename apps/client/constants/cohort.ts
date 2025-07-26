import type { Part } from '@dpm-core/api';
import type { StaticImageData } from 'next/image';
import ANDROID from '@/assets/icons/aos.webp';
import DESIGN from '@/assets/icons/design.webp';
import IOS from '@/assets/icons/ios.webp';
import SERVER from '@/assets/icons/server.webp';
import WEB from '@/assets/icons/web.webp';

const cohort: Record<
	Exclude<Part, 'ETC'>,
	{
		icon: StaticImageData;
		label: string;
	}
> = {
	WEB: {
		icon: WEB,
		label: '웹',
	},
	ANDROID: {
		icon: ANDROID,
		label: '안드로이드',
	},
	IOS: {
		icon: IOS,
		label: 'IOS',
	},
	DESIGN: {
		icon: DESIGN,
		label: '디자이너',
	},
	SERVER: {
		icon: SERVER,
		label: '서버',
	},
};

export { cohort };
