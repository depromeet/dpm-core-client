'use client';

import { cn, createContext } from '@dpm-core/shared';
import { type ComponentPropsWithoutRef, type PropsWithChildren, useState } from 'react';

interface BillTypeFilterProps<T = string> {
	value?: T;
	defaultValue?: T;
	onChange?: (value: T) => void;
}

interface BillTypeFilterItemProps<T = string> {
	value: T;
	label?: string;
}

const [BillTypeFilterProvider, useBillTypeFilter] = createContext<BillTypeFilterProps>(
	'Bill-type-filter',
	{
		value: undefined,
		defaultValue: undefined,
		onChange: undefined,
	},
);

const BillTypeFilter = <T extends string>({
	value,
	defaultValue,
	onChange,
	children,
	...rest
}: PropsWithChildren<BillTypeFilterProps<T>> &
	Omit<ComponentPropsWithoutRef<'div'>, 'onChange'>) => {
	const [internalValue, setInternalValue] = useState<T>(defaultValue as T);

	const isControlled = value !== undefined;
	const currentValue = isControlled ? value : internalValue;

	const handleChange = (newValue: T) => {
		if (!isControlled) {
			setInternalValue(newValue);
		}
		onChange?.(newValue);
	};
	return (
		<BillTypeFilterProvider value={currentValue} onChange={handleChange as (value: string) => void}>
			<div {...rest}>{children}</div>
		</BillTypeFilterProvider>
	);
};

const BillTypeFilterItem = <T extends string>({ value, label }: BillTypeFilterItemProps<T>) => {
	const { value: currentValue, onChange } = useBillTypeFilter();
	const isSelected = currentValue === value;
	return (
		<button
			type="button"
			data-selected={isSelected}
			className={cn(
				'rounded-md py-1 px-3 border border-line-normal text-label-assistive text-sm font-medium transition-colors cursor-pointer',
				isSelected && 'bg-gray-800 border-gray-800 text-gray-0',
			)}
			onClick={() => onChange?.(value as T)}
		>
			{label ?? value}
		</button>
	);
};

export { BillTypeFilter, BillTypeFilterItem };
