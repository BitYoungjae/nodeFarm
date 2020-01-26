import { createServer } from 'http';
import { parse } from 'url';
import { parseQuery } from './lib/queryParser.js';
import { apiHandler, overviewHandler, initData } from './lib/routing.js';

const main = async () => {
  await initData();
  const server = createServer();

  server.on('request', async (req, res) => {
    const { path, query } = parse(req.url);
    if (path === '/favicon.ico') return res.end();

    const queryMap = parseQuery(query);
    const [, mainMethod, ...pathList] = path.split('/');

    res.writeHead(200, {
      'Content-Type': 'application/json',
    });

    switch (mainMethod) {
      case '':
      case 'overview':
        await overviewHandler(res, pathList);
        break;
      case 'api':
        await apiHandler(res, pathList);
        break;
      default:
        res.end('Hello World');
    }
  });

  server.listen(3000, () => console.log('now listen'));
};

main();
