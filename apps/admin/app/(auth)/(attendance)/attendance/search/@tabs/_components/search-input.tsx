'use client';

import { DebouncedSearchInput } from '@/components/debounced-search-input';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';

export const SearchInput = () => {
	const searchParams = useCustomSearchParams();

	const nameValue = searchParams.get('name') ?? undefined;

	return (
		<DebouncedSearchInput
			value={nameValue}
			onChange={(name) => searchParams.update({ name }, 'REPLACE')}
			onClear={() => searchParams.update({ name: '' }, 'REPLACE')}
			containerClassName="w-67.5"
		/>
	);
};
