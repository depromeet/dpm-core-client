import { ErrorBoundary, Suspense } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { getBiilsQueryOptions } from '@/remotes/queries/bill';
import SettleListItem1 from './SettleListItem1';
import SettleListItem2 from './SettleListItem2';
import SettleListItem3 from './SettleListItem3';

const SettlementListContainer = () => {
	const { data } = useSuspenseQuery(getBiilsQueryOptions);

	return (
		<ul className="flex flex-col">
			{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
				<SettleListItem1 key={item} />
			))}
			<SettleListItem2 />
			<SettleListItem3 />
		</ul>
	);
};

const SettleList = ErrorBoundary.with(
	{
		fallback: (props) => <ErrorBox onReset={() => props.reset()} />,
	},
	() => (
		<Suspense fallback={<LoadingBox />}>
			<SettlementListContainer />
		</Suspense>
	),
);

export default SettleList;
