import type { ExcuseDocumentStatus } from '@dpm-core/api';

interface ExcuseDocumentCellProps {
	status: ExcuseDocumentStatus | undefined;
}

export function ExcuseDocumentCell({ status }: ExcuseDocumentCellProps) {
	if (status === 'SUBMITTED') {
		return (
			<span className="text-body2 font-semibold whitespace-nowrap text-primary-normal">
				제출 완료
			</span>
		);
	}
	if (status === 'PENDING') {
		return (
			<span className="text-body2 font-semibold whitespace-nowrap text-label-assistive">
				제출 이전
			</span>
		);
	}
	return <span className="text-body2 font-medium text-label-normal">-</span>;
}
