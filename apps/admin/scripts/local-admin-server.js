/* eslint-disable @typescript-eslint/no-var-requires */

const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const port = 3020;
const hostname = 'local-admin.depromeet.shop';
const dev = process.env.NODE_ENV !== 'production';

// 어드민 앱 디렉토리 지정 (상위 디렉토리)
const appDir = path.join(__dirname, '..');

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
			key: fs.readFileSync(path.join(__dirname, '..', '..', '..', 'local-admin.depromeet.shop-key.pem')),
			cert: fs.readFileSync(path.join(__dirname, '..', '..', '..', 'local-admin.depromeet.shop.pem')),
		},
		(req, res) => {
			const parsedUrl = parse(req.url, true);
			handle(req, res, parsedUrl);
		},
	);

	localServer.listen(port);

	console.log(` ✅ Admin Ready: \t https://${hostname}:${port} \n`);
});
