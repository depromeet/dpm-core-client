'use client';

import { SearchIcon } from 'lucide-react';
import { cn, Input } from '@dpm-core/shared';

import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { useDebounce } from '@/hooks/useDebounce';

export const SearchInput = ({ className, ...props }: React.ComponentProps<'input'>) => {
	const searchParams = useCustomSearchParams();

	const nameValue = searchParams.get('name') ?? undefined;

	const handleSearch = useDebounce(
		(event) => searchParams.update({ name: event.target.value }, 'REPLACE'),
		300,
	);

	return (
		<div className="relative">
			<Input
				className={cn('pr-11.5', className)}
				defaultValue={nameValue}
				onChange={handleSearch}
				{...props}
			/>
			<SearchIcon className="-translate-y-1/2 absolute top-1/2 right-4 size-5 text-icon-noraml" />
		</div>
	);
};
