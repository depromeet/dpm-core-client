import Image from 'next/image';

import LoginBannerImage from '@/assets/images/login-banner.png';

export default function LoginLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex min-h-dvh w-full">
			<div className="relative hidden flex-1 lg:block">
				<Image src={LoginBannerImage} alt="Login Banner" priority fill className="object-cover" />
			</div>
			<main className="flex w-full items-center justify-center bg-primary-extralight lg:w-[430px]">
				{children}
			</main>
		</div>
	);
}
