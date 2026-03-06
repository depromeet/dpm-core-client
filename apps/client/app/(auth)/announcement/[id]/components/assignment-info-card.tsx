import { ExternalLink } from 'lucide-react';

interface AssignmentInfoCardProps {
	dueAt?: string;
	assignmentType?: 'INDIVIDUAL' | 'TEAM' | null;
	submitLink?: string;
}

const ASSIGNMENT_TYPE_LABEL: Record<string, string> = {
	INDIVIDUAL: '개인 과제',
	TEAM: '팀 과제',
};

export const AssignmentInfoCard = ({
	dueAt,
	assignmentType,
	submitLink,
}: AssignmentInfoCardProps) => {
	return (
		<div className="flex flex-col gap-3 rounded-xl bg-background-subtle p-4">
			<div className="flex gap-6 font-medium text-body2">
				<span className="shrink-0 text-label-subtle">제출 기한</span>
				<span className="text-label-normal">{dueAt || '-'}</span>
			</div>
			<div className="flex gap-6 font-medium text-body2">
				<span className="shrink-0 text-label-subtle">과제 유형</span>
				<span className="text-label-normal">
					{assignmentType ? (ASSIGNMENT_TYPE_LABEL[assignmentType] ?? '-') : '-'}
				</span>
			</div>
			{submitLink && (
				<div className="flex items-center gap-6 font-medium text-body2">
					<span className="shrink-0 text-label-subtle">과제 링크</span>
					<a
						href={submitLink}
						target="_blank"
						rel="noopener noreferrer"
						className="flex min-w-0 flex-1 items-center gap-1 text-label-normal"
					>
						<span className="truncate">{submitLink}</span>
						<ExternalLink className="size-4 shrink-0" />
					</a>
				</div>
			)}
		</div>
	);
};
