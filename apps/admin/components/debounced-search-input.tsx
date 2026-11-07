'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button, cn } from '@dpm-core/shared';

interface DebouncedSearchInputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'defaultValue' | 'value' | 'onChange'> {
	value: string | undefined;
	onChange: (value: string) => void;
	onClear?: () => void;
	delay?: number;
	containerClassName?: string;
}

export function DebouncedSearchInput({
	delay = 300,
	containerClassName,
	value,
	className,
	onChange,
	onClear,
	...props
}: DebouncedSearchInputProps) {
	const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	const [input, setInput] = useState(value ?? '');
	const [isFocused, setIsFocused] = useState(false);

	const showClearButton = Boolean(input) && isFocused;

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nextInput = e.currentTarget.value;

		setInput(nextInput);
		clearTimeout(timerRef.current);

		timerRef.current = setTimeout(() => {
			onChange(nextInput.trim());
		}, delay);
	};

	const handleClearSearch = () => {
		clearTimeout(timerRef.current);
		setInput('');
		onClear?.();
	};

	const handleSearchBlur = (e: React.FocusEvent<HTMLDivElement>) => {
		const isFocusInside = e.currentTarget.contains(e.relatedTarget);

		if (isFocusInside) return;

		setIsFocused(false);
	};

	useEffect(() => {
		setInput(value ?? '');

		return () => clearTimeout(timerRef.current);
	}, [value]);

	return (
		<div
			className={cn(
				'flex h-10 w-50 items-center gap-2 rounded-lg border border-line-normal bg-background-normal px-4',
				containerClassName,
			)}
			onFocus={() => setIsFocused(true)}
			onBlur={handleSearchBlur}
		>
			<input
				placeholder="디퍼 검색"
				{...props}
				value={input}
				onChange={handleInputChange}
				className={cn(
					'min-w-0 flex-1 bg-transparent font-medium text-body2 outline-none placeholder:text-label-assistive',
					className,
				)}
			/>
			{showClearButton ? (
				<Button
					type="button"
					variant="none"
					size="none"
					title="검색 초기화"
					onClick={handleClearSearch}
					className="size-4 rounded-full bg-background-strong text-label-assistive"
					onMouseDown={(e) => e.preventDefault()}
				>
					<X className="size-3" />
				</Button>
			) : (
				<Search className="size-4 shrink-0 text-label-assistive" />
			)}
		</div>
	);
}
