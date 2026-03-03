import Image from 'next/image';
import Link from 'next/link';

import IconGuide from '@/assets/icons/icon_guide.png';
import IconVoc from '@/assets/icons/icon_voc.png';

export const VocBanner = () => {
	return (
		<div className="flex items-start gap-3 self-stretch px-4">
			<Link
				href="https://forms.gle/yV88T98WsADu6VNc6"
				target="_blank"
				className="flex h-29 flex-1 flex-col items-start gap-3 rounded-lg border border-(--icon-inverse,#fff) bg-[linear-gradient(133deg,#FFF_24.8%,#F9FAFF_59.35%,var(--Blue-50,#EFF3FF)_73.36%)] p-4 shadow-[0_0_10px_0_rgba(0,0,0,0.04)]"
			>
				<div className="flex items-center justify-between self-stretch">
					<span className="font-semibold text-body2 text-label-subtle">
						디프만 코어
						<br />
						VOC 수집중!
					</span>
					<Image src={IconVoc} alt="VOC" width={40} height={40} />
				</div>
				<span className="self-stretch font-medium text-caption1 text-gray-400">
					코어를 사용하며 느낀 점을
					<br />
					자유롭게 들려주세요!
				</span>
			</Link>
			<Link
				href="https://depromeet.notion.site"
				target="_blank"
				className="flex h-29 flex-1 flex-col items-start gap-3 rounded-lg border border-(--icon-inverse,#fff) bg-[linear-gradient(133deg,#FFF_24.8%,#F8FEFF_56.78%,#EFFDFF_73.36%)] p-4 shadow-[0_0_10px_0_rgba(0,0,0,0.04)]"
			>
				<div className="flex items-center justify-between self-stretch">
					<span className="font-semibold text-body2 text-label-subtle">
						사용 가이드
						<br />
						보러가기
					</span>
					<Image src={IconGuide} alt="VOC" width={40} height={40} />
				</div>
				<span className="self-stretch font-medium text-caption1 text-gray-400">
					코어의 자세한
					<br />
					사용법이 궁금하다면?
				</span>
			</Link>
		</div>
	);
};
