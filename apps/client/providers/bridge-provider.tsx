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
});
