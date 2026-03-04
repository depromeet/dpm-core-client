import { cn } from '@dpm-core/shared';

function Empty({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="empty"
			className={cn(
				'flex w-full min-w-0 flex-col items-center justify-center gap-4 text-balance rounded-lg border-dashed px-4 py-4 text-center',
				className,
			)}
			{...props}
		/>
	);
}

function EmptyHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="empty-header"
			className={cn('flex flex-col items-center gap-3', className)}
			{...props}
		/>
	);
}

function EmptyTitle({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="empty-title"
			className={cn('font-semibold text-body1 text-label-assistive', className)}
			{...props}
		/>
	);
}

function EmptyDescription({ className, ...props }: React.ComponentProps<'p'>) {
	return (
		<div
			data-slot="empty-description"
			className={cn('font-medium text-body2', className)}
			{...props}
		/>
	);
}

function EmptyContent({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="empty-content"
			className={cn(
				'flex w-full min-w-0 flex-col items-center gap-3 text-balance text-body2',
				className,
			)}
			{...props}
		/>
	);
}

export { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent };
