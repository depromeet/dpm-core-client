import { CLARITY_ACTION_ID, type ClarityActionId } from '@/constants/clarity';

type Outcome = 'success' | 'fail';
type Track = (action: ClarityActionId) => void;

const trackers = new WeakMap<object, Map<number, InsightClarityTracker>>();

/** Suspense가 첫 렌더를 재시도해도 해당 탭의 조회 결과를 보존한다. */
export class InsightClarityTracker {
	private active = false;
	private closed = false;
	private lastOutcome: Outcome | null = null;
	private pendingSuccess = false;

	constructor(
		private readonly client: object,
		private readonly sessionId: number,
		private track: Track,
	) {}

	setTrack(track: Track) {
		this.track = track;
	}

	activate() {
		this.closed = false;
		let bySession = trackers.get(this.client);
		if (!bySession) {
			bySession = new Map();
			trackers.set(this.client, bySession);
		}
		bySession.set(this.sessionId, this);
		this.active = true;
		if (this.pendingSuccess) {
			this.pendingSuccess = false;
			this.emit('success');
		}
	}

	record(outcome: Outcome) {
		if (this.closed || this.lastOutcome === outcome) return;
		this.lastOutcome = outcome;
		if (outcome === 'success' && !this.active) {
			this.pendingSuccess = true;
			return;
		}
		this.pendingSuccess = false;
		this.emit(outcome);
	}

	release() {
		this.active = false;
		this.closed = true;
		const bySession = trackers.get(this.client);
		if (bySession?.get(this.sessionId) === this) bySession.delete(this.sessionId);
	}

	private emit(outcome: Outcome) {
		try {
			this.track(
				outcome === 'success'
					? CLARITY_ACTION_ID.SESSION_DETAIL.INSIGHT_LOAD_SUCCESS
					: CLARITY_ACTION_ID.SESSION_DETAIL.INSIGHT_LOAD_FAIL,
			);
		} catch {
			// 분석 이벤트가 실패해도 인사이트 조회 결과를 유지한다.
		}
	}
}

export const getInsightClarityTracker = (client: object, sessionId: number, track: Track) => {
	let bySession = trackers.get(client);
	if (!bySession) {
		bySession = new Map();
		trackers.set(client, bySession);
	}
	let tracker = bySession.get(sessionId);
	if (!tracker) {
		tracker = new InsightClarityTracker(client, sessionId, track);
		bySession.set(sessionId, tracker);
	} else {
		tracker.setTrack(track);
	}
	return tracker;
};
