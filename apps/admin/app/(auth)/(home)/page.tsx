import Link from 'next/link';
import { AppLayout, ChevronRight, GAPageTracker } from '@dpm-core/shared';

import { Section } from '@/components/section';

import { CurrentWeekSession } from './_components/current-week-session';
import { HomeAttendance } from './_components/home-attendance';
import HomeHeader from './_components/home-header';
import { MobileNav } from './_components/mobile-nav';
import { SessionBanner } from './_components/session-banner';
import { SessionProivder } from './_components/session-provider';

const HomePage = () => {
	return (
		<AppLayout className="bg-background-normal">
			<GAPageTracker type="home" />
			<HomeHeader />
			<main>
				<SessionProivder>
					<SessionBanner />

					<Section className="mt-5 border-background-strong border-b-8 pb-10 md:hidden">
						<MobileNav />
					</Section>

					<Section>
						<CurrentWeekSession />
					</Section>

					<Section className="md:hidden">
						<Link
							href="https://forms.gle/yV88T98WsADu6VNc6"
							target="_blank"
							className="flex items-center justify-between rounded-lg bg-primary-extralight p-5"
						>
							<div>
								<h3 className="font-bold text-primary-normal text-title2">
									디프만 코어 VOC 수집중!
								</h3>
								<p className="mt-2 text-body2 text-label-assistive">
									디프만 코어, 어떻게 느끼고 계신가요?
									<br />
									여러분의 의견을 기다리고 있어요!
								</p>
							</div>
							<ChevronRight className="text-icon-noraml" />
						</Link>
					</Section>

					<HomeAttendance />
				</SessionProivder>
			</main>
		</AppLayout>
	);
};

export default HomePage;
