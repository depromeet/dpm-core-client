'use client';

import type React from 'react';
import { NoticeTag } from './notice-tag';
import { cn } from '../utils/cn';

export interface NoticeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  date: string;
  readCount: number;
  tags?: Array<'default' | 'assignment' | 'individual' | 'team' | 'etc'>;
  showHover?: boolean;
}

export const NoticeCard = ({
  className,
  title,
  date,
  readCount,
  tags = [],
  showHover = true,
  onClick,
  ...props
}: NoticeCardProps) => {
  return (
    <div
      className={cn(
        'flex w-full flex-col gap-4 rounded-xl bg-background-normal p-4',
        showHover && 'cursor-pointer hover:bg-gray-100/60',
        className,
      )}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
              }
            }
          : undefined
      }
      onClick={onClick}
      {...props}
    >
      {tags.length > 0 && (
        <div className="flex flex-wrap items-start gap-2">
          {tags.map((tag, index) => (
            <NoticeTag key={index} type={tag} />
          ))}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <p className="line-clamp-1 font-semibold text-body1 text-label-normal">
          {title}
        </p>

        <div className="flex items-center gap-1 text-caption1 text-label-assistive">
          <span>{date}</span>
          <div className="h-3 w-px bg-gray-400" />
          <span>{readCount}명 읽음</span>
        </div>
      </div>
    </div>
  );
};
