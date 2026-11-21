import fs from 'node:fs';
import { createServer } from 'node:https';
import path from 'node:path';
import { fileURLToPath, parse } from 'node:url';
import next from 'next';

const port = 3020;
const hostname = 'local-admin.depromeet.com';
const dev = process.env.NODE_ENV !== 'production';

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptPath);

// 어드민 앱 디렉토리 지정 (상위 디렉토리)
const appDir = path.join(scriptDir, '..');

const app = next({
	port,
	dev,
	hostname,
	dir: appDir,
});
const handle = app.getRequestHandler();

console.log(' 🚀 어드민 로컬 서버 시작중...');

app.prepare().then(() => {
	const localServer = createServer(
		{
			key: fs.readFileSync(
				path.join(scriptDir, '..', '..', '..', 'local-admin.depromeet.com-key.pem'),
			),
			cert: fs.readFileSync(
				path.join(scriptDir, '..', '..', '..', 'local-admin.depromeet.com.pem'),
			),
		},
		(req, res) => {
			const parsedUrl = parse(req.url, true);
			handle(req, res, parsedUrl);
		},
	);

	localServer.listen(port);

	console.log(` ✅ Admin Ready: \t https://${hostname}:${port} \n`);
});
