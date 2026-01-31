'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
	Button,
	Calendar,
	cn,
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	koLocale,
	WheelPicker,
	WheelPickerWrapper,
} from '@dpm-core/shared';

// react-day-picker DayButton의 props 타입 정의
interface CustomDayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	day: { date: Date };
	modifiers: {
		today?: boolean;
		selected?: boolean;
		outside?: boolean;
		focused?: boolean;
	};
}

interface DateTimePickerDrawerProps {
	title: string;
	value?: Date;
	onChange: (date: Date) => void;
	children: React.ReactNode;
	/** 선택한 날짜에 표시할 라벨 (기본: "회식") */
	selectedLabel?: string;
	/** 캘린더에 별도로 표시할 날짜 (예: 회식 날짜) */
	highlightedDate?: Date;
	/** highlightedDate에 표시할 라벨 (예: "회식") */
	highlightedLabel?: string;
}

const PERIOD_OPTIONS = [
	{ value: '오전', label: '오전' },
	{ value: '오후', label: '오후' },
];

const HOUR_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
	value: String(i + 1),
	label: `${i + 1}시`,
}));

// 커스텀 DayButton 생성 함수 - highlightedDate와 라벨을 클로저로 전달
const createCustomDayButton = (
	selectedLabel: string,
	highlightedDate?: Date,
	highlightedLabel?: string,
) => {
	// highlightedDate가 있으면 마감 Drawer (선택=검은색, 회식=파란색)
	// highlightedDate가 없으면 회식 Drawer (선택=파란색)
	const isDeadlineMode = !!highlightedDate;

	const CustomDayButton = ({
		day,
		modifiers,
		children: _children,
		className: _className,
		...props
	}: CustomDayButtonProps) => {
		const isToday = modifiers.today;
		const isSelected = modifiers.selected;
		const isOutside = modifiers.outside;

		// highlightedDate와 같은 날짜인지 확인 (회식 날짜)
		const isHighlighted =
			highlightedDate &&
			day.date.getFullYear() === highlightedDate.getFullYear() &&
			day.date.getMonth() === highlightedDate.getMonth() &&
			day.date.getDate() === highlightedDate.getDate();

		// 선택된 날짜와 하이라이트 날짜가 같으면 하이라이트(회식) 스타일 우선
		const showHighlight = isHighlighted && !isSelected;

		return (
			<button
				type="button"
				className={cn(
					'flex h-[45px] w-full flex-col items-center justify-center rounded-md px-[11px] py-[5px]',
					// 마감 Drawer: 선택(마감)=검은색, 회식 Drawer: 선택(회식)=파란색
					isSelected && isDeadlineMode && 'bg-[#1F2937]',
					isSelected && !isDeadlineMode && 'bg-[#5E83FE]',
					// 회식 날짜 (하이라이트): 파란색
					showHighlight && 'bg-[#5E83FE]',
					isToday && !isSelected && !showHighlight && 'bg-[#F3F4F6]',
					!isSelected && !isToday && !showHighlight && 'bg-white',
				)}
				{...props}
			>
				<span
					className={cn(
						'font-medium text-[14px] leading-[142%]',
						// 마감/회식 날짜 텍스트: 흰색
						isSelected && 'text-white',
						showHighlight && 'text-white',
						!isSelected && !showHighlight && isOutside && 'text-[#D1D5DB]',
						!isSelected && !showHighlight && !isOutside && 'text-[#4B5563]',
					)}
				>
					{day.date.getDate()}
				</span>
				{isToday && !isSelected && !showHighlight && (
					<span className="font-medium text-[#4B5563] text-[10px] leading-[133%]">오늘</span>
				)}
				{isSelected && (
					<span className="font-medium text-[10px] text-white leading-[133%]">{selectedLabel}</span>
				)}
				{showHighlight && highlightedLabel && (
					<span className="font-medium text-[10px] text-white leading-[133%]">
						{highlightedLabel}
					</span>
				)}
			</button>
		);
	};
	return CustomDayButton;
};

export const DateTimePickerDrawer = ({
	title,
	value,
	onChange,
	children,
	selectedLabel = '회식',
	highlightedDate,
	highlightedLabel,
}: DateTimePickerDrawerProps) => {
	const [open, setOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);

	// 시간 값 추출
	const getInitialPeriod = () => {
		if (!value) return '오후';
		return value.getHours() < 12 ? '오전' : '오후';
	};

	const getInitialHour = () => {
		if (!value) return '6';
		const hours = value.getHours();
		if (hours === 0) return '12';
		if (hours > 12) return String(hours - 12);
		return String(hours);
	};

	const [selectedPeriod, setSelectedPeriod] = useState(getInitialPeriod());
	const [selectedHour, setSelectedHour] = useState(getInitialHour());

	const handleConfirm = () => {
		if (!selectedDate) return;

		const date = new Date(selectedDate);
		const hour = Number(selectedHour);
		const hours = selectedPeriod === '오전' ? hour % 12 : (hour % 12) + 12;
		date.setHours(hours);
		date.setMinutes(0);
		date.setSeconds(0);

		onChange(date);
		setOpen(false);
	};

	const handleOpenChange = (isOpen: boolean) => {
		// Drawer가 열릴 때 트리거 버튼에서 포커스 해제 (aria-hidden 경고 방지)
		if (isOpen && document.activeElement instanceof HTMLElement) {
			document.activeElement.blur();
		}
		setOpen(isOpen);
		if (isOpen) {
			setSelectedDate(value);
			setSelectedPeriod(getInitialPeriod());
			setSelectedHour(getInitialHour());
		}
	};

	// 오전/오후 토글
	const handlePeriodUp = () => {
		setSelectedPeriod((prev) => (prev === '오전' ? '오후' : '오전'));
	};
	const handlePeriodDown = () => {
		setSelectedPeriod((prev) => (prev === '오후' ? '오전' : '오후'));
	};

	// 시간 증감
	const handleHourUp = () => {
		setSelectedHour((prev) => {
			const current = Number(prev);
			return current === 1 ? '12' : String(current - 1);
		});
	};
	const handleHourDown = () => {
		setSelectedHour((prev) => {
			const current = Number(prev);
			return current === 12 ? '1' : String(current + 1);
		});
	};

	return (
		<Drawer modal={false} open={open} onOpenChange={handleOpenChange}>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent
				aria-describedby={undefined}
				className="mx-auto flex max-h-[90vh] max-w-lg flex-col"
			>
				<DrawerHeader showCloseButton className="shrink-0 px-5 pt-5 pb-4 text-left">
					<DrawerTitle className="font-semibold text-[#1F2937] text-[18px] leading-[144%]">
						{title}
					</DrawerTitle>
				</DrawerHeader>

				<div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 pb-3">
					{/* 날짜 선택 */}
					<div className="flex flex-col gap-3">
						<p className="font-semibold text-[#4B5563] text-[14px] leading-[142%]">날짜 선택</p>
						<Calendar
							mode="single"
							locale={koLocale}
							selected={selectedDate}
							onSelect={setSelectedDate}
							className="w-full p-0"
							components={{
								DayButton: createCustomDayButton(selectedLabel, highlightedDate, highlightedLabel),
							}}
						/>
					</div>

					{/* 시간 선택 */}
					<div className="flex flex-col gap-3">
						<p className="font-semibold text-[#4B5563] text-[14px] leading-[142%]">시간 선택</p>
						<div className="flex items-center justify-center gap-3">
							{/* 오전/오후 선택 */}
							<div className="flex flex-1 flex-col items-center">
								<button
									type="button"
									onClick={handlePeriodUp}
									className="flex h-9 w-full items-center justify-center"
								>
									<ChevronUp className="h-5 w-5 text-[#1F2937]" />
								</button>
								<div className="relative flex h-[138px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#F6F7F9]">
									<WheelPickerWrapper className="[&_[data-rwp]]:!h-[138px] h-[138px] w-full rounded-xl border-none bg-transparent px-0 shadow-none">
										<WheelPicker
											options={PERIOD_OPTIONS}
											value={selectedPeriod}
											onValueChange={setSelectedPeriod}
											optionItemHeight={46}
											classNames={{
												optionItem:
													'!h-[46px] !text-[20px] !font-medium !leading-[46px] !text-[#D1D5DB] !flex !items-center !justify-center',
												highlightWrapper: '!h-[46px] !bg-transparent',
												highlightItem:
													'!h-[46px] !text-[20px] !font-medium !leading-[46px] !text-[#131416] !flex !items-center !justify-center',
											}}
										/>
									</WheelPickerWrapper>
									{/* 상단 그라데이션 */}
									<div className="pointer-events-none absolute top-0 right-0 left-0 h-[46px] bg-gradient-to-b from-[#F6F7F9] to-transparent" />
									{/* 하단 그라데이션 */}
									<div className="pointer-events-none absolute right-0 bottom-0 left-0 h-[46px] bg-gradient-to-t from-[#F6F7F9] to-transparent" />
								</div>
								<button
									type="button"
									onClick={handlePeriodDown}
									className="flex h-9 w-full items-center justify-center"
								>
									<ChevronDown className="h-5 w-5 text-[#1F2937]" />
								</button>
							</div>

							{/* 시간 선택 */}
							<div className="flex flex-1 flex-col items-center">
								<button
									type="button"
									onClick={handleHourUp}
									className="flex h-9 w-full items-center justify-center"
								>
									<ChevronUp className="h-5 w-5 text-[#1F2937]" />
								</button>
								<div className="relative flex h-[138px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#F6F7F9]">
									<WheelPickerWrapper className="[&_[data-rwp]]:!h-[138px] h-[138px] w-full rounded-xl border-none bg-transparent px-0 shadow-none">
										<WheelPicker
											options={HOUR_OPTIONS}
											value={selectedHour}
											onValueChange={setSelectedHour}
											optionItemHeight={46}
											classNames={{
												optionItem:
													'!h-[46px] !text-[20px] !font-medium !leading-[46px] !text-[#D1D5DB] !flex !items-center !justify-center',
												highlightWrapper: '!h-[46px] !bg-transparent',
												highlightItem:
													'!h-[46px] !text-[20px] !font-medium !leading-[46px] !text-[#131416] !flex !items-center !justify-center',
											}}
										/>
									</WheelPickerWrapper>
									{/* 상단 그라데이션 */}
									<div className="pointer-events-none absolute top-0 right-0 left-0 h-[46px] bg-gradient-to-b from-[#F6F7F9] to-transparent" />
									{/* 하단 그라데이션 */}
									<div className="pointer-events-none absolute right-0 bottom-0 left-0 h-[46px] bg-gradient-to-t from-[#F6F7F9] to-transparent" />
								</div>
								<button
									type="button"
									onClick={handleHourDown}
									className="flex h-9 w-full items-center justify-center"
								>
									<ChevronDown className="h-5 w-5 text-[#1F2937]" />
								</button>
							</div>
						</div>
					</div>
				</div>

				<DrawerFooter className="shrink-0 px-5 pt-3 pb-5">
					<Button
						type="button"
						variant="secondary"
						size="full"
						className="h-[48px] rounded-lg bg-[#1F2937] font-semibold text-[16px] text-white leading-[150%] hover:bg-[#1F2937]/90"
						onClick={handleConfirm}
						disabled={!selectedDate}
					>
						적용하기
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};
