'use client';

import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { Input } from '@dpm-core/shared';
import { SearchIcon } from 'lucide-react';

export const SearchInput = ({ className, ...props }: React.ComponentProps<'input'>) => {
	const searchParams = useCustomSearchParams();

	return (
		<div className="relative">
			<Input
				type="search"
				className="pr-11.5"
				onChange={(event) => searchParams.update({ query: event.target.value }, 'REPLACE')}
				{...props}
			/>
			<SearchIcon className="absolute top-1/2 -translate-y-1/2 right-4 size-5 text-icon-noraml" />
		</div>
	);
};
