'use client';

import {
	Button,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
} from '@dpm-core/shared';
import { useFormContext, useWatch } from 'react-hook-form';

const MAX_LENGTH = 20;

interface FormStepItemProps {
	index: number;
	onRemove: () => void;
}

export const FormStepItem = ({ index, onRemove }: FormStepItemProps) => {
	const { control } = useFormContext();
	const title = useWatch({ name: `gatherings.${index}.title`, control });

	return (
		<li className="py-5 relative px-4 border border-line-normal rounded-lg flex flex-col gap-6">
			{/* 닫기 버튼 */}
			{index > 0 && (
				<Button asChild size="none" variant="none" onClick={onRemove} className="w-fit p-1 ml-auto">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="12"
						height="12"
						viewBox="0 0 12 12"
						fill="none"
						className="cursor-pointer fill-current text-gray-400 hover:text-label-subtle  transition-colors"
					>
						<title>icon</title>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M11.2803 0.209721C11.5732 0.502614 11.5732 0.977488 11.2803 1.27038L1.28033 11.2704C0.987437 11.5633 0.512563 11.5633 0.21967 11.2704C-0.0732233 10.9775 -0.0732233 10.5026 0.21967 10.2097L10.2197 0.209721C10.5126 -0.083172 10.9874 -0.083172 11.2803 0.209721Z"
						/>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M0.21967 0.209721C0.512563 -0.083172 0.987437 -0.083172 1.28033 0.209721L11.2803 10.2097C11.5732 10.5026 11.5732 10.9775 11.2803 11.2704C10.9874 11.5633 10.5126 11.5633 10.2197 11.2704L0.21967 1.27038C-0.0732233 0.977488 -0.0732233 0.502614 0.21967 0.209721Z"
						/>
					</svg>
				</Button>
			)}

			{/* 차수 이름 */}
			<FormField
				control={control}
				name={`gatherings.${index}.title`}
				render={({ field }) => (
					<FormItem>
						<FormLabel>회식 차수 이름</FormLabel>
						<FormControl>
							<Input
								type="text"
								placeholder={`ex. ${index + 1}차 - 장소`}
								maxLength={MAX_LENGTH}
								className="bg-inherit border border-line-normal"
								{...field}
							/>
						</FormControl>
						{/* TODO 차수 추가 시 자동 스크롤 구현 */}
						<div className="flex items-center relative min-h-4">
							<FormMessage />
							<span className="absolute top-0 right-0 text-label-subtle text-caption1 font-medium">
								{title.length}/{MAX_LENGTH}자
							</span>
						</div>
					</FormItem>
				)}
			/>

			{/* 금액 입력 */}
			<FormField
				control={control}
				name={`gatherings.${index}.receipt.amount`}
				render={({ field }) => (
					<FormItem>
						<FormLabel>금액</FormLabel>
						<FormControl>
							<input
								inputMode="numeric"
								placeholder="금액 입력 (원)"
								className="outline-none px-3 py-2 text-title2 font-semibold border-b border-line-normal placeholder:text-label-disable focus:border-gray-900 w-full aria-invalid:border-red-400"
								value={field.value}
								onChange={(e) => {
									const raw = e.target.value.replace(/[^0-9]/g, '');
									const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
									field.onChange(formatted);
								}}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</li>
	);
};
