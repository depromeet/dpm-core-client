'use client';

import { cn, createContext } from '@dpm-core/shared';
import { type ComponentPropsWithoutRef, type PropsWithChildren, useState } from 'react';

interface SettlementTypeFilterProps<T = string> {
	value?: T;
	defaultValue?: T;
	onChange?: (value: T) => void;
}

interface SettlementTypeFilterItemProps<T = string> {
	value: T;
	label?: string;
}

const [SettlementTypeFilterProvider, useSettlementTypeFilter] =
	createContext<SettlementTypeFilterProps>('settlement-type-filter', {
		value: undefined,
		defaultValue: undefined,
		onChange: undefined,
	});

const SettlementTypeFilter = <T extends string>({
	value,
	defaultValue,
	onChange,
	children,
	...rest
}: PropsWithChildren<SettlementTypeFilterProps<T>> & ComponentPropsWithoutRef<'div'>) => {
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
		<SettlementTypeFilterProvider
			value={currentValue}
			onChange={handleChange as (value: string) => void}
		>
			<div {...rest}>{children}</div>
		</SettlementTypeFilterProvider>
	);
};

const SettlementTypeFilterItem = <T extends string>({
	value,
	label,
}: SettlementTypeFilterItemProps<T>) => {
	const { value: currentValue, onChange } = useSettlementTypeFilter();
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

export { SettlementTypeFilter, SettlementTypeFilterItem };
