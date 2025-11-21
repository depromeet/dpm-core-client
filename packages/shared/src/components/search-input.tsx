'use client';

import { useRef } from 'react';
import { SearchIcon } from 'lucide-react';

import { useComposedRefs } from '../hooks/use-compose-refs';
import { cn } from '../utils/cn';
import { Button } from './ui/button';
import { Input, type InputProps } from './ui/input';

export const SearchInput = ({ type = 'search', className, ref, ...props }: InputProps) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const composeInputdRef = useComposedRefs(ref, inputRef);

	const handleFocusInput = () => {
		inputRef.current?.focus();
	};

	return (
		<div className={cn('relative', className)}>
			<Input className="pr-11.5" type={type} ref={composeInputdRef} {...props} />
			<Button
				onClick={handleFocusInput}
				variant="none"
				size="none"
				tabIndex={-1}
				className="-translate-y-1/2 absolute top-1/2 right-4"
			>
				<SearchIcon className="size-5 text-icon-noraml" />
			</Button>
		</div>
	);
};
