import { AppLayout, ChevronLeft } from '@dpm-core/shared';
import { Link } from 'next-view-transitions';
import { NavigationBar } from '@/components/navigation-bar';
import { AttendanceResultContainer } from './_components/attendance-result-container';
import { AttendanceTimeContainer } from './_components/attendance-time-container';
import { FloatingButtonContainer } from './_components/floating-button-container';

const AttendanceCheckResultPage = () => {
	return (
		<AppLayout className="bg-gray-0">
			<NavigationBar>
				<Link href="/">
					<ChevronLeft />
				</Link>
			</NavigationBar>
			<AttendanceResultContainer />
			<AttendanceTimeContainer />
			<FloatingButtonContainer />
		</AppLayout>
	);
};

export default AttendanceCheckResultPage;
