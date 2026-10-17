'use client';

import { cn } from '../utils/cn';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';

export interface SegmentedOption {
	value: string;
	label: string;
	/** 읽기 전용 값. 선택은 막되 현재 상태로는 보여줘야 할 때 사용한다. */
	disabled?: boolean;
}

export interface SegmentedOptionsProps {
	options: SegmentedOption[];
	/** 선택된 값. 빈 문자열이면 아무것도 선택하지 않은 상태 (혼합 값 등) */
	value: string;
	onChange: (value: string) => void;
	className?: string;
	'aria-label'?: string;
}

/**
 * 가로로 나열된 선택지 중 하나를 고르는 세그먼트 컨트롤.
 * 선택지가 무엇을 의미하는지는 알지 못하며, 파트·팀·상태 등 어떤 목록에도 그대로 쓸 수 있다.
 */
export const SegmentedOptions = ({
	className,
	options,
	value,
	onChange,
	...props
}: SegmentedOptionsProps) => {
	return (
		<ToggleGroup
			type="single"
			value={value}
			onValueChange={(next) => {
				// 선택된 항목을 다시 누르면 radix 가 빈 문자열을 넘기므로 선택 해제를 막는다.
				if (next) onChange(next);
			}}
			className={cn(
				'h-12 w-full overflow-hidden rounded-lg border border-line-normal bg-comp-fill-white',
				className,
			)}
			{...props}
		>
			{options.map(({ value: optionValue, label, disabled }) => (
				<ToggleGroupItem
					key={optionValue}
					value={optionValue}
					disabled={disabled}
					className={cn(
						'h-full min-w-0 flex-1 rounded-none border-line-normal border-l px-3 font-medium text-body2 text-label-assistive first:border-l-0',
						'data-[state=on]:bg-primary-extralight data-[state=on]:font-semibold data-[state=on]:text-primary-normal',
						'disabled:cursor-not-allowed disabled:opacity-40',
					)}
				>
					<span className="truncate">{label}</span>
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
};
