import { Aesterisk, cn } from '@dpm-core/shared';

export const MemberEmptyView = ({ className, ...restProps }: React.ComponentProps<'div'>) => {
	return (
		<div
			className={cn('flex flex-1 flex-col items-center justify-center gap-y-3', className)}
			{...restProps}
		>
			<Aesterisk />
			<p className="font-semibold text-body1 text-label-assistive">
				조건에 맞는 디퍼를 찾을 수 없어요
			</p>
		</div>
	);
};
