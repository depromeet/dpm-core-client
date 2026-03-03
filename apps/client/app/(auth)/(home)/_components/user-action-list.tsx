import Link from 'next/link';

const USER_VOC_LINK = 'https://forms.gle/yV88T98WsADu6VNc6';
const USER_GUIDE_LINK =
	'https://www.notion.so/depromeet/31745b4338b380e2b8e8f64767fb27f1?source=copy_link';

export const UserActionList = () => {
	return (
		<section className="my-2 px-4">
			<div className="flex gap-3">
				<Link
					href={USER_VOC_LINK}
					target="_blank"
					className="flex basis-1/2 flex-col items-start gap-3 rounded-lg bg-[linear-gradient(133deg,#ffffff_24.8%,#f9faff_59.35%,#eff3ff_73.36%)] p-4 shadow-[0_0_10px_rgba(0,0,0,0.04)]"
				>
					<div>
						<p className="font-semibold text-body2 text-label-subtle">
							디프만 코어 <br />
							VOC 수집중!
						</p>
					</div>

					<p className="text-caption1 text-label-assistive">
						코어를 사용하며 느낀 점을
						<br />
						자유롭게 들려주세요!
					</p>
				</Link>
				<Link
					href={USER_GUIDE_LINK}
					className="flex basis-1/2 flex-col items-start gap-3 rounded-lg bg-[linear-gradient(133deg,#ffffff_24.8%,#f8feff_56.78%,#effdff_73.36%)] p-4 shadow-[0_0_10px_rgba(0,0,0,0.04)]"
				>
					<div>
						<p className="font-semibold text-body2 text-label-subtle">
							사용 가이드
							<br />
							보러가기
						</p>
					</div>
					<p className="text-caption1 text-label-assistive">
						코어의 자세한
						<br />
						사용법이 궁금하다면?
					</p>
				</Link>
			</div>
		</section>
	);
};
