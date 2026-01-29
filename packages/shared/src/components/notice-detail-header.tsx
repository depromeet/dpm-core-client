'use client';

import type React from 'react';
import { ChevronLeft, PenSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { type Profile } from './profile-stack';
import { cn } from '../utils/cn';

export interface NoticeDetailHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  readProfiles?: Profile[];
  readCount?: number;
  onBack?: () => void;
  onEdit?: () => void;
  showEditButton?: boolean;
}

export const NoticeDetailHeader = ({
  className,
  title,
  readProfiles = [],
  readCount,
  onBack,
  onEdit,
  showEditButton = true,
  ...props
}: NoticeDetailHeaderProps) => {
  const displayProfiles = readProfiles.slice(0, 3);
  const totalReadCount = readCount ?? readProfiles.length;

  return (
    <div
      className={cn(
        'flex h-20 items-center gap-3 border-b border-line-normal bg-background-normal px-6',
        className,
      )}
      {...props}
    >
      {/* 뒤로가기 버튼 */}
      <button
        type="button"
        onClick={onBack}
        className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg p-3 hover:bg-background-hover"
        aria-label="뒤로 가기"
      >
        <ChevronLeft className="size-5 text-icon-noraml" />
      </button>

      {/* 제목 */}
      <h1 className="flex-1 font-bold text-headline1 text-label-normal tracking-[-0.48px]">
        {title}
      </h1>

      {/* Action Group */}
      <div className="flex items-center gap-6">
        {/* Read List */}
        {displayProfiles.length > 0 && (
          <div className="flex items-center gap-1">
            {/* Profile Stack */}
            <div className="flex items-center">
              {displayProfiles.map((profile, index) => (
                <Avatar
                  key={profile.id}
                  className={cn(
                    'size-10 border-2 border-white',
                    index > 0 && '-ml-5',
                  )}
                >
                  {profile.avatarSrc && (
                    <AvatarImage src={profile.avatarSrc} alt={profile.name} />
                  )}
                  <AvatarFallback className="bg-primary-extralight text-primary-normal">
                    {profile.avatarFallback || profile.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>

            {/* 읽음 텍스트 */}
            <p className="font-semibold text-body2 text-label-assistive">
              +{totalReadCount}명 읽음
            </p>
          </div>
        )}

        {/* 수정하기 버튼 */}
        {showEditButton && (
          <Button variant="secondary" size="lg" onClick={onEdit}>
            <PenSquare className="size-5" />
            수정하기
          </Button>
        )}
      </div>
    </div>
  );
};
