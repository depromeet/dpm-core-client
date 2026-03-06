import { cn } from '../utils/cn';
import { NoticeTag } from './notice-tag';

type NoticeTagType = 'default' | 'assignment' | 'individual' | 'team' | 'etc';

export interface NoticeInfoProps {
	title: string;
	date: string;
	readCount: number;
	tags: NoticeTagType[];
	/** 외부 컨테이너 gap 등 오버라이드 */
	className?: string;
	/** 제목 텍스트 스타일 오버라이드 */
	titleClassName?: string;
	/** 날짜/읽음수 텍스트 스타일 오버라이드 */
	captionClassName?: string;
	/** 구분선 스타일 오버라이드 */
	dividerClassName?: string;
}

export const NoticeInfo = ({
	title,
	date,
	readCount,
	tags,
	className,
	titleClassName,
	captionClassName,
	dividerClassName,
}: NoticeInfoProps) => {
	return (
		<div className={cn('flex flex-col gap-2', className)}>
			{tags.length > 0 && (
				<div className="flex flex-wrap items-start gap-2">
					{tags.map((tag) => (
						<NoticeTag key={tag} type={tag} />
					))}
				</div>
			)}
			<div className="flex flex-col gap-2">
				<p className={cn('font-semibold text-body1 text-label-normal', titleClassName)}>{title}</p>
				<div
					className={cn(
						'flex items-center gap-1 text-caption1 text-label-assistive',
						captionClassName,
					)}
				>
					<span>{date}</span>
					<div className={cn('h-3 w-px bg-gray-400', dividerClassName)} />
					<span>{readCount}명 읽음</span>
				</div>
			</div>
		</div>
	);
};
