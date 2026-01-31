'use client';

import { useRef, useState } from 'react';
import { cn } from '@dpm-core/shared';

interface Option {
	id: string;
	label: string;
}

interface TagSelectProps {
	value: string[];
	onChange: (tags: string[]) => void;
	options: Option[];
	placeholder?: string;
	className?: string;
}

export const TagSelect = ({
	value,
	onChange,
	options,
	placeholder = '선택해주세요',
	className,
}: TagSelectProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const selectedOptions = options.filter((opt) => value.includes(opt.id));
	const unselectedOptions = options.filter((opt) => !value.includes(opt.id));

	const handleToggleOption = (optionId: string) => {
		if (value.includes(optionId)) {
			onChange(value.filter((id) => id !== optionId));
		} else {
			onChange([...value, optionId]);
		}
		inputRef.current?.focus();
	};

	const handleRemoveTag = (optionId: string) => {
		onChange(value.filter((id) => id !== optionId));
	};

	const handleContainerClick = () => {
		setIsOpen(true);
		inputRef.current?.focus();
	};

	return (
		<div className="relative">
			<div
				onClick={handleContainerClick}
				className={cn(
					'flex min-h-[48px] w-full cursor-text flex-wrap items-center gap-2 rounded-lg border border-line-normal bg-white px-3 py-2 transition-colors',
					isOpen && 'border-gray-900',
					className,
				)}
			>
				{selectedOptions.map((opt) => (
					<span
						key={opt.id}
						className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 font-medium text-[#1F2937] text-caption1"
					>
						@ {opt.label}
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								handleRemoveTag(opt.id);
							}}
							className="flex h-4 w-4 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
						>
							<svg
								width="10"
								height="10"
								viewBox="0 0 10 10"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
							>
								<path
									d="M7.5 2.5L2.5 7.5M2.5 2.5L7.5 7.5"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>
					</span>
				))}
				<input
					ref={inputRef}
					type="text"
					readOnly
					onFocus={() => setIsOpen(true)}
					onBlur={() => setIsOpen(false)}
					placeholder={selectedOptions.length === 0 ? placeholder : ''}
					className="min-w-[20px] flex-1 cursor-text bg-transparent font-medium text-body2 caret-gray-900 outline-none placeholder:text-[#9CA3AF]"
				/>
			</div>

			{isOpen && unselectedOptions.length > 0 && (
				<div className="absolute top-full right-0 left-0 z-10 mt-1 flex max-h-[200px] flex-wrap gap-2 overflow-y-auto rounded-lg border border-line-normal bg-white p-3 shadow-lg">
					{unselectedOptions.map((opt) => (
						<button
							key={opt.id}
							type="button"
							onMouseDown={(e) => e.preventDefault()}
							onClick={() => handleToggleOption(opt.id)}
							className="rounded-md bg-gray-100 px-2 py-1 font-medium text-[#4B5563] text-caption1 transition-colors hover:bg-gray-200"
						>
							@ {opt.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
};
