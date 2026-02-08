'use client';

import { type ComponentPropsWithoutRef, type PropsWithChildren, useState } from 'react';
import { cn, createContext, DragScrollContainer } from '@dpm-core/shared';

import { useAfterPartyListFilterSearchParams } from '../_hooks/use-after-party-list-filter-search-pararms';

interface AfterPartyListFilterProps<T = string> {
	value?: T;
	defaultValue?: T;
	onChange?: (value: T) => void;
}

interface AfterPartyListFilterItemProps<T = string> {
	value: T;
	label?: string;
}

const [AfterPartyListFilterProvider, useAfterPartyListFilter] =
	createContext<AfterPartyListFilterProps>('After-party-list-filter', {
		value: undefined,
		defaultValue: undefined,
		onChange: undefined,
	});

const AfterPartyListFilter = <T extends string>({
	value,
	defaultValue,
	onChange,
	children,
	...rest
}: PropsWithChildren<AfterPartyListFilterProps<T>> &
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
		<AfterPartyListFilterProvider
			value={currentValue}
			onChange={handleChange as (value: string) => void}
		>
			<div {...rest}>{children}</div>
		</AfterPartyListFilterProvider>
	);
};

const AfterPartyListFilterItem = <T extends string>({
	value,
	label,
}: AfterPartyListFilterItemProps<T>) => {
	const { value: currentValue, onChange } = useAfterPartyListFilter();
	const isSelected = currentValue === value;
	const styles = {
		base: 'font-medium text-body2 inline-block flex shrink-0 h-[32px] items-center justify-center px-[12px] py-[6.5px] rounded-lg cursor-pointer',
		unSelected: 'bg-gray-100 text-gray-800',
		selected: 'bg-gray-800 text-white',
	};

	return (
		<span
			className={cn(styles.base, isSelected ? styles.selected : styles.unSelected)}
			onClick={() => onChange?.(value as T)}
		>
			{label ?? value}
		</span>
	);
};

const AfterPartyStatusFilter = () => {
	const { afterPartyStatus, handleChange } = useAfterPartyListFilterSearchParams();

	return (
		<AfterPartyListFilter value={afterPartyStatus} onChange={handleChange}>
			<DragScrollContainer className="space-x-[8px] px-[16px] py-[12px]">
				<AfterPartyListFilterItem value="ALL" label="전체" />
				<AfterPartyListFilterItem value="IN_PROGRESS" label="진행 중" />
			</DragScrollContainer>
		</AfterPartyListFilter>
	);
};

export { AfterPartyStatusFilter };
