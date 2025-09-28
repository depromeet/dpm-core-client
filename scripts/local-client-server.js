/* eslint-disable @typescript-eslint/no-var-requires */

const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const port = 3010;
const hostname = 'local-core.depromeet-core.shop';
const dev = process.env.NODE_ENV !== 'production';

// 클라이언트 앱 디렉토리 지정
const appDir = path.join(__dirname, '..', 'apps', 'client');

const app = next({ 
  port, 
  dev, 
  hostname,
  dir: appDir
});
const handle = app.getRequestHandler();

console.log(' 🚀 클라이언트 로컬 서버 시작중...');

app.prepare().then(() => {
  const localServer = createServer(
    {
      key: fs.readFileSync(path.join(__dirname, '..', 'local-core.depromeet-core.shop-key.pem')),
      cert: fs.readFileSync(path.join(__dirname, '..', 'local-core.depromeet-core.shop.pem')),
    },
    (req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    },
  );

  localServer.listen(port);

  console.log(` ✅ Client Ready: \t https://${hostname}:${port} \n`);
});