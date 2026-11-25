/// <reference types="vite/client" />

/* oxlint-disable import/no-unassigned-import -- Preview에서 제품 전역 CSS와 웹 safe area를 로드합니다. */
import { definePreview } from '@storybook/nextjs-vite';
import { AppShell } from '@dpm-core/shared';

import { pretendard } from '../app/fonts';
import { BridgeProvider } from '../providers/bridge-provider';
import '../app/globals.css';
import './preview.css';

export default definePreview<[]>({
	parameters: {
		layout: 'fullscreen',
		nextjs: { appDirectory: true, navigation: { pathname: '/' } },
		controls: { disable: true },
		options: {
			storySort: {
				order: [
					'Cases',
					['홈', ['활동 흐름', '본문', '출석 배너', '출석 코드 시트', '프로필 및 안내']],
				],
			},
		},
		viewport: {
			options: {
				mobile: { name: '모바일', styles: { width: '375px', height: '812px' } },
			},
		},
	},
	initialGlobals: { viewport: { value: 'mobile', isRotated: false } },
	decorators: [
		(Story, { id }) => (
			<div key={id} className={`font-pretendard ${pretendard.variable}`} lang="ko">
				<BridgeProvider>
					<AppShell>
						<Story />
					</AppShell>
				</BridgeProvider>
			</div>
		),
	],
});
