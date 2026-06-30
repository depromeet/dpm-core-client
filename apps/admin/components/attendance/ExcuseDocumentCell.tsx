import type { ExcuseDocumentStatus } from '@dpm-core/api';

interface ExcuseDocumentCellProps {
	status: ExcuseDocumentStatus | undefined;
}

export function ExcuseDocumentCell({ status }: ExcuseDocumentCellProps) {
	if (status === 'SUBMITTED') {
		return (
			<span className="whitespace-nowrap font-semibold text-body2 text-primary-normal">
				제출 완료
			</span>
		);
	}
	if (status === 'PENDING') {
		return (
			<span className="whitespace-nowrap font-semibold text-body2 text-label-assistive">
				제출 이전
			</span>
		);
	}
	return <span className="font-medium text-body2 text-label-normal">-</span>;
}
