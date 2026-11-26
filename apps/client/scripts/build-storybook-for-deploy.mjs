import { execFileSync } from 'node:child_process';
import { cpSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const clientRoot = fileURLToPath(new URL('../', import.meta.url));
const output = join(clientRoot, 'storybook-static');
const publicStorybook = join(clientRoot, 'public', 'storybook');

// public은 Storybook의 staticDirs 입력이므로 직전 빌드 사본을 먼저 비웁니다.
rmSync(publicStorybook, { recursive: true, force: true });
execFileSync('pnpm', ['build-storybook'], { cwd: clientRoot, stdio: 'inherit' });

for (const entry of ['index.html', 'iframe.html']) {
	const path = join(output, entry);
	const html = readFileSync(path, 'utf8');
	if (!html.includes('<head>')) throw new Error(`Missing <head> in ${entry}`);
	// Next.js가 /storybook/을 /storybook으로 정규화해도 상대 경로를 하위 디렉터리에서 찾습니다.
	writeFileSync(path, html.replace('<head>', '<head><base href="/storybook/">'));
}

cpSync(output, publicStorybook, { recursive: true });
