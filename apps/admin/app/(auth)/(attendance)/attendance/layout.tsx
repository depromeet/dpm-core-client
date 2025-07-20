import { Fragment, type ReactNode } from 'react';
import { NavigationBar } from '@/components/navigation-bar';

interface LayoutProps {
	tabs: ReactNode;
}

export default function Layout({ tabs }: LayoutProps) {
	return (
		<Fragment>
			<NavigationBar>
				<h1 className="absolute left-1/2 -translate-x-1/2 font-semibold text-body1">출석</h1>
			</NavigationBar>
			{tabs}
		</Fragment>
	);
}
