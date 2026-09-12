import fs from 'node:fs';
import { createServer } from 'node:https';
import path from 'node:path';
import { fileURLToPath, parse } from 'node:url';
import next from 'next';

const port = 3010;
const hostname = 'local-core.depromeet.com';
const dev = process.env.NODE_ENV !== 'production';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 클라이언트 앱 디렉토리 지정 (상위 디렉토리)
const appDir = path.join(__dirname, '..');

const app = next({
	port,
	dev,
	hostname,
	dir: appDir,
});
const handle = app.getRequestHandler();

console.log(' 🚀 클라이언트 로컬 서버 시작중...');

app.prepare().then(() => {
	const localServer = createServer(
		{
			key: fs.readFileSync(
				path.join(__dirname, '..', '..', '..', 'local-core.depromeet.com-key.pem'),
			),
			cert: fs.readFileSync(path.join(__dirname, '..', '..', '..', 'local-core.depromeet.com.pem')),
		},
		(req, res) => {
			const parsedUrl = parse(req.url, true);
			handle(req, res, parsedUrl);
		},
	);

	localServer.listen(port);

	console.log(` ✅ Client Ready: \t https://${hostname}:${port} \n`);
});
