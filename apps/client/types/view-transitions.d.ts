// View Transitions API 타입 정의
interface ViewTransition {
	finished: Promise<void>;
	ready: Promise<void>;
	updateCallbackDone: Promise<void>;
	skipTransition(): void;
}

interface Document {
	startViewTransition?(updateCallback?: () => void | Promise<void>): ViewTransition;
}

// Navigation 타입 정의
export type NavigationType = 'PUSH' | 'POP';

export interface TransitionOptions {
	actionType?: NavigationType;
	onTransitionReady?: () => void;
}
