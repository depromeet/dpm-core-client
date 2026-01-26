'use client';

import type React from 'react';
import { Input } from '../ui/input';
import { cn } from '../../utils/cn';

export interface SubmissionLinkCellProps extends React.ComponentProps<
  typeof Input
> {
  isHeader?: boolean;
}

export const SubmissionLinkCell = ({
  className,
  isHeader = false,
  ...props
}: SubmissionLinkCellProps) => {
  if (isHeader) {
    return (
      <div
        className={cn(
          'flex h-10 items-center gap-2.5 px-3 bg-background-strong',
          className,
        )}
      >
        <p className="font-medium text-body2 text-label-subtle">과제 점수</p>
      </div>
    );
  }

  return (
    <div className={cn('flex h-17.5 items-center px-3', className)}>
      <Input type="text" placeholder="예) 100" className="h-10" {...props} />
    </div>
  );
};
