import type { ExcuseDocumentStatus } from '@dpm-core/api';

interface ExcuseDocumentCellProps {
	status: ExcuseDocumentStatus | undefined;
}

export function ExcuseDocumentCell({ status }: ExcuseDocumentCellProps) {
	if (status === 'SUBMITTED') {
		return (
			<span className="font-semibold text-body2 text-primary-normal whitespace-nowrap">
				제출 완료
			</span>
		);
	}
	if (status === 'PENDING') {
		return (
			<span className="font-semibold text-body2 text-label-assistive whitespace-nowrap">
				제출 이전
			</span>
		);
	}
	return <span className="font-medium text-body2 text-label-normal">-</span>;
}
