'use client';

import { ChevronRight } from '@dpm-core/shared';

import { CLARITY_ACTION_ID } from '@/constants/clarity';
import { useOpenExternalUrl } from '@/hooks/use-open-external-url';
import { useClarity } from '@/providers/client-clarity-adapter';

const ATTENDANCE_POLICY_PDF_PATH = '/attendance-policy-19.pdf';

export const AttendancePolicyButton = () => {
	const { track } = useClarity();
	const { openExternalUrl } = useOpenExternalUrl();

	return (
		<button
			type="button"
			className="flex items-center gap-1"
			onClick={async () => {
				track(CLARITY_ACTION_ID.ATTENDANCE_ME.POLICY_BUTTON_CLICK);

				await openExternalUrl(`${window.location.origin}${ATTENDANCE_POLICY_PDF_PATH}`);
			}}
		>
			<span className="text-caption1 font-medium text-label-tertiary">규정</span>
			<ChevronRight className="size-3 text-icon-noraml" />
		</button>
	);
};
