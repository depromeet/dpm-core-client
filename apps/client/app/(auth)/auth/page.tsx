import { AppLayout } from '@dpm-core/shared';

export default function SignupPage() {
	return (
		<AppLayout className="items-center justify-center bg-[linear-gradient(169deg,var(--Background-Normal,#FFF)_20.53%,#CFD9FF_60.84%,#E6F9FF_99%)] px-4 pt-8">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="43"
				height="43"
				viewBox="0 0 43 43"
				fill="none"
			>
				<title>auth-logo</title>
				<path
					d="M21.5 0C32.8259 3.52747e-05 42.1063 8.75773 42.939 19.8706H25.3874L31.053 14.2052L28.903 12.0552L23.1291 17.8289V9.77245H20.1973V17.9384L14.3151 12.0563L12.1653 14.2061L17.8299 19.8706H9.77231V23.1283H17.8297L12.1646 28.7936L14.3146 30.9435L20.1973 25.0606V33.2268H23.1291V25.1698L28.9038 30.9445L31.0536 28.7947L25.3872 23.1283H42.939C42.1068 34.2417 32.8263 43 21.5 43C9.6259 43 4.85779e-05 33.3741 0 21.5001C0 9.62602 9.62587 0 21.5 0Z"
					fill="url(#paint0_linear_20292_54255)"
				/>
				<path
					d="M43 21.5001C43 21.5186 42.9997 21.5371 42.9996 21.5556V21.4444C42.9997 21.4629 43 21.4816 43 21.5001Z"
					fill="url(#paint1_linear_20292_54255)"
				/>
				<defs>
					<linearGradient
						id="paint0_linear_20292_54255"
						x1="21.5"
						y1="22"
						x2="21.5"
						y2="43"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#1F2937" />
						<stop offset="0.754971" stop-color="#3E4CB8" />
						<stop offset="1" stop-color="#5769F1" />
					</linearGradient>
					<linearGradient
						id="paint1_linear_20292_54255"
						x1="21.5"
						y1="22"
						x2="21.5"
						y2="43"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#1F2937" />
						<stop offset="0.754971" stop-color="#3E4CB8" />
						<stop offset="1" stop-color="#5769F1" />
					</linearGradient>
				</defs>
			</svg>
			<h1 className="mt-6 mb-4 bg-[linear-gradient(95deg,#5359D6_30.58%,#0D1A34_60.1%,#737EAE_77.42%)] bg-clip-text text-center font-bold text-headline2 text-transparent">
				운영진이 회원 정보를
				<br />
				검토하고 있어요
			</h1>
			<p className="bg-[linear-gradient(90deg,var(--Label-Subtle,#4B5563)_0%,#7A98C2_100%)] bg-clip-text text-center font-medium text-body1 text-transparent">
				승인이 완료되면 홈화면에 접속할 수 있어요
			</p>
		</AppLayout>
	);
}
