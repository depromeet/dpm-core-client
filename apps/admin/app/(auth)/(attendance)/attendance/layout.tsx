import { ChevronLeft } from '@dpm-core/shared';
import { Link } from 'next-view-transitions';
import { Fragment, type ReactNode } from 'react';
import { NavigationBar } from '@/components/navigation-bar';

interface LayoutProps {
	tabs: ReactNode;
}

export default function Layout({ tabs }: LayoutProps) {
	return (
		<Fragment>
			<NavigationBar className="flex items-center py-2 px-4">
				<Link href="/">
					<ChevronLeft />
				</Link>
				<h1 className="absolute left-1/2 -translate-x-1/2 font-semibold text-body1">출석</h1>
			</NavigationBar>
			{tabs}
		</Fragment>
	);
}
