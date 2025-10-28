import { cn } from '@dpm-core/shared';

export const Section = ({ className, children, ...props }: React.ComponentProps<'section'>) => {
	return (
		<section
			className={cn(
				'mx-auto w-full max-w-[1200px] px-4 md:px-10 [&+section]:mt-5 md:[&+section]:mt-10',
				className,
			)}
			{...props}
		>
			{children}
		</section>
	);
};
