import { defineMain } from '@storybook/nextjs-vite/node';

export default defineMain({
	framework: '@storybook/nextjs-vite',
	stories: ['../app/**/*.stories.tsx'],
	staticDirs: ['../public'],
	features: { experimentalTestSyntax: true },
});
