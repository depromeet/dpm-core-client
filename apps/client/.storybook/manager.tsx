import React from 'react';
import { AddonPanel } from 'storybook/internal/components';
import { addons, types, useParameter } from 'storybook/manager-api';

const panelId = 'dpm-core/case-conditions';
const panelTitle = '이 화면이 나오는 조건';

function CaseConditionsPanel({ active }: { active: boolean }) {
	const conditions = useParameter<string[]>('caseConditions', []);

	if (!conditions.length) return null;

	return (
		<AddonPanel active={active}>
			<section style={{ padding: 16 }}>
				<h2 style={{ fontSize: 14, margin: '0 0 12px' }}>{panelTitle}</h2>
				<ul
					aria-label={panelTitle}
					style={{
						display: 'grid',
						gap: 8,
						lineHeight: 1.6,
						listStyleType: 'disc',
						margin: 0,
						overflowWrap: 'anywhere',
						paddingInlineStart: 16,
					}}
				>
					{conditions.map((condition) => (
						<li key={condition}>{condition}</li>
					))}
				</ul>
			</section>
		</AddonPanel>
	);
}

addons.register(panelId, () => {
	addons.add(panelId, {
		title: '화면 조건',
		type: types.PANEL,
		render: ({ active = false }) => React.createElement(CaseConditionsPanel, { active }),
	});
});

addons.setConfig({ panelPosition: 'right', selectedPanel: panelId, showPanel: true });
