'use client';
import { createLinkBridgeProvider } from '@webview-bridge/react';
import type { AppBridge } from '@dpm-core/native';

export const {
	BridgeProvider,
	useBridgeStore,
	useBridgeStatus,
	useBridgeLoose,
	useBridgeEventListener,
} = createLinkBridgeProvider<AppBridge>({
	throwOnError: true,
	// 대화형 네이티브 메서드(카카오 로그인, 푸시 권한 등)는 사용자 입력 대기 시간이
	// 길어서 default 2초로는 부족. 0으로 비활성화. 각 메서드는 자체 try/catch + SDK
	// 내부 timeout으로 안전망 확보.
	timeout: 0,
});
