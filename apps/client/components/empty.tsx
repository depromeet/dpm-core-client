import { cn } from '@dpm-core/shared';

function Empty({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="empty"
			className={cn(
				'flex w-full min-w-0 flex-col items-center justify-center gap-4 rounded-lg border-dashed px-4 py-4 text-center text-balance',
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
			className={cn('text-body1 font-semibold text-label-assistive', className)}
			{...props}
		/>
	);
}

function EmptyDescription({ className, ...props }: React.ComponentProps<'p'>) {
	return (
		<div
			data-slot="empty-description"
			className={cn('text-body2 font-medium', className)}
			{...props}
		/>
	);
}

function EmptyContent({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="empty-content"
			className={cn(
				'flex w-full min-w-0 flex-col items-center gap-3 text-body2 text-balance',
				className,
			)}
			{...props}
		/>
	);
}

export { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent };
