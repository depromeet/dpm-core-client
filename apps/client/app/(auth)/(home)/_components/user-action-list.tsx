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
					className="flex basis-1/2 flex-col items-start gap-3 rounded-lg border border-background-normal bg-[linear-gradient(133deg,#ffffff_24.8%,#f9faff_59.35%,#eff3ff_73.36%)] p-4 shadow-[0_0_10px_rgba(0,0,0,0.04)]"
				>
					<div className="flex w-full flex-wrap items-center justify-between">
						<p className="font-semibold text-body2 text-label-subtle">
							디프만 코어 <br />
							VOC 수집중!
						</p>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="40"
							height="40"
							viewBox="0 0 40 40"
							fill="none"
						>
							<title>voc</title>
							<g clipPath="url(#clip0_20614_2958)">
								<path
									d="M33.099 13.9777C32.575 12.7507 31.482 11.8917 30.207 11.6357V17.7567C30.207 18.4097 29.971 19.0007 29.592 19.4737C29.086 20.1037 28.319 20.5157 27.448 20.5157H12.551C11.68 20.5157 10.913 20.1037 10.407 19.4737C10.028 19.0017 9.79201 18.4097 9.79201 17.7567V11.6357C8.51701 11.8917 7.42301 12.7507 6.90001 13.9777L3.33301 22.3357H36.666L33.099 13.9777Z"
									fill="#2085F7"
								/>
								<path
									d="M3.33301 22.3359V32.0819C3.33301 33.9599 4.85601 35.4829 6.73401 35.4829H33.265C35.143 35.4829 36.666 33.9599 36.666 32.0819V22.3359H3.33301Z"
									fill="#64A7FF"
								/>
								<path
									d="M10.408 19.4739L16.899 14.2999L9.79297 8.37793V17.7569C9.79297 18.4099 10.029 19.0009 10.408 19.4739Z"
									fill="#D0D5DA"
								/>
								<path
									d="M23.1011 14.2999L29.5921 19.4739C29.9711 19.0019 30.2071 18.4099 30.2071 17.7569V8.37793L23.1011 14.2999Z"
									fill="#D0D5DA"
								/>
								<path
									d="M16.899 14.2999L18.122 15.3189C19.253 16.1959 20.748 16.1959 21.878 15.3189L23.101 14.2999L30.207 8.37793L21.878 14.1169C20.747 14.8959 19.252 14.8959 18.122 14.1169L9.79297 8.37793L16.899 14.2999Z"
									fill="#AFB7C0"
								/>
								<path
									d="M21.8782 15.3186C20.7472 16.1956 19.2522 16.1956 18.1222 15.3186L16.8992 14.2996L10.4082 19.4736C10.9142 20.1036 11.6812 20.5156 12.5522 20.5156H27.4492C28.3202 20.5156 29.0872 20.1036 29.5932 19.4736L23.1022 14.2996L21.8782 15.3186Z"
									fill="#E5E9EE"
								/>
								<path
									d="M18.122 14.1166C19.253 14.8956 20.748 14.8956 21.878 14.1166L30.207 8.37763V7.27463C30.207 5.75063 28.972 4.51562 27.448 4.51562H12.551C11.028 4.51562 9.79199 5.75063 9.79199 7.27463V8.37763L18.122 14.1166Z"
									fill="#E5E9EE"
								/>
								<path d="M40 0H0V40H40V0Z" fill="url(#paint0_linear_20614_2958)" />
							</g>
							<defs>
								<linearGradient
									id="paint0_linear_20614_2958"
									x1="20.5"
									y1="3.5"
									x2="36.4707"
									y2="40"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="#EFF3FF" stopOpacity="0" />
									<stop offset="1" stopColor="#EFF3FF" />
								</linearGradient>
								<clipPath id="clip0_20614_2958">
									<rect width="40" height="40" fill="white" />
								</clipPath>
							</defs>
						</svg>
					</div>
					<p className="text-caption1 text-label-assistive">
						코어를 사용하며 느낀 점을
						<br />
						자유롭게 들려주세요!
					</p>
				</Link>
				<Link
					href={USER_GUIDE_LINK}
					className="flex basis-1/2 flex-col items-start gap-3 rounded-lg border border-background-normal bg-[linear-gradient(133deg,#ffffff_24.8%,#f8feff_56.78%,#effdff_73.36%)] p-4 shadow-[0_0_10px_rgba(0,0,0,0.04)]"
				>
					<div className="flex w-full flex-wrap items-center justify-between">
						<p className="font-semibold text-body2 text-label-subtle">
							사용 가이드
							<br />
							보러가기
						</p>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="40"
							height="40"
							viewBox="0 0 40 40"
							fill="none"
						>
							<title>user-guide</title>
							<g clipPath="url(#clip0_20614_2975)">
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M4.37598 5.48V34.52C4.37598 35.614 5.26198 36.5 6.35598 36.5H22.526L32.426 26.6V5.48C32.426 4.386 31.54 3.5 30.446 3.5H6.35598C5.26198 3.5 4.37598 4.386 4.37598 5.48Z"
									fill="#E5E9EE"
								/>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M24.5059 26.5996H32.4259L22.5259 36.4996V28.5796C22.5259 27.4856 23.4119 26.5996 24.5059 26.5996Z"
									fill="#C0C7D1"
								/>
								<path d="M32.425 8.94434H4.375V9.91534H32.425V8.94434Z" fill="#D0D5DA" />
								<path d="M32.425 13.5303H4.375V14.5013H32.425V13.5303Z" fill="#D0D5DA" />
								<path d="M32.425 18.1165H4.375V19.0875H32.425V18.1165Z" fill="#D0D5DA" />
								<path d="M32.425 22.7024H4.375V23.6734H32.425V22.7024Z" fill="#D0D5DA" />
								<path
									d="M32.4258 6.42969H34.6538C35.1898 6.42969 35.6248 6.86469 35.6248 7.40069V12.5487C35.6248 13.0847 35.1898 13.5197 34.6538 13.5197H32.4258V6.43069V6.42969Z"
									fill="#4592FB"
								/>
								<path
									d="M34.6538 23.5187H32.4258V16.4297H34.6538C35.1898 16.4297 35.6248 16.8647 35.6248 17.4007V22.5487C35.6248 23.0847 35.1898 23.5197 34.6538 23.5197V23.5187Z"
									fill="#FFC100"
								/>
								<path
									d="M0 40L40 40L40 0L0 0L0 40Z"
									fill="url(#paint0_linear_20614_2975)"
									fillOpacity="0.8"
								/>
							</g>
							<defs>
								<linearGradient
									id="paint0_linear_20614_2975"
									x1="13"
									y1="17"
									x2="26.5"
									y2="35"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="#F0FEFF" stopOpacity="0" />
									<stop offset="1" stopColor="#F0FEFF" />
								</linearGradient>
								<clipPath id="clip0_20614_2975">
									<rect width="40" height="40" fill="white" />
								</clipPath>
							</defs>
						</svg>
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
