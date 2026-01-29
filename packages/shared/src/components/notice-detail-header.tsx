'use client';

import type React from 'react';
import { ChevronLeft } from 'lucide-react';
import { IconButton } from './icon-button';
import { ProfileStack, type Profile } from './profile-stack';
import { Button } from './ui/button';
import { cn } from '../utils/cn';

export interface NoticeDetailHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  readProfiles?: Profile[];
  onBack?: () => void;
  onEdit?: () => void;
  showEditButton?: boolean;
}

export const NoticeDetailHeader = ({
  className,
  title,
  readProfiles = [],
  onBack,
  onEdit,
  showEditButton = true,
  ...props
}: NoticeDetailHeaderProps) => {
  return (
    <div
      className={cn(
        'flex h-20 items-center gap-3 border-b border-line-normal bg-background-normal px-6',
        className,
      )}
      {...props}
    >
      <IconButton
        variant="ghost"
        size="md"
        onClick={onBack}
        aria-label="뒤로 가기"
      >
        <ChevronLeft className="size-5" />
      </IconButton>
      <h1 className="flex-1 font-bold text-headline1 text-label-normal">
        {title}
      </h1>

      <div className="flex items-center gap-6">
        {readProfiles.length > 0 && (
          <ProfileStack profiles={readProfiles} max={3} />
        )}

        {showEditButton && (
          <Button variant="secondary" size="lg" onClick={onEdit}>
            수정하기
          </Button>
        )}
      </div>
    </div>
  );
};
