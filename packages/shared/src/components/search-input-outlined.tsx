'use client';

import * as React from 'react';
import { SearchIcon } from 'lucide-react';

import { cn } from '../utils/cn';

export interface SearchInputOutlinedProps extends Omit<React.ComponentProps<'input'>, 'type'> {
	/**
	 * 검색 입력 필드의 placeholder 텍스트
	 * @default "디퍼 검색"
	 */
	placeholder?: string;
}

/**
 * Outlined 스타일의 검색 입력 컴포넌트
 *
 * 기본 SearchInput과 달리 아이콘이 장식 요소로만 사용되며,
 * border 스타일이 적용된 심플한 디자인입니다.
 *
 * @example
 * ```tsx
 * const inputRef = useRef<HTMLInputElement>(null);
 * <SearchInputOutlined ref={inputRef} placeholder="검색어 입력" />
 * ```
 */
export const SearchInputOutlined = React.forwardRef<HTMLInputElement, SearchInputOutlinedProps>(
	({ placeholder = '디퍼 검색', className, ...props }, ref) => {
		return (
			<div
				className={cn(
					'flex items-center gap-2.5 rounded-lg border border-line-normal bg-background-normal p-4',
					className,
				)}
			>
				<input
					ref={ref}
					type="search"
					className="h-5 min-w-0 flex-1 bg-transparent font-medium text-body2 text-label-normal outline-none placeholder:text-label-assistive"
					placeholder={placeholder}
					{...props}
				/>
				<SearchIcon className="size-4 shrink-0 text-label-assistive" />
			</div>
		);
	},
);

SearchInputOutlined.displayName = 'SearchInputOutlined';
