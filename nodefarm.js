import { createServer } from 'http';
import { parse } from 'url';
import { parseQuery } from './lib/queryParser.js';
import { apiHandler, overviewHandler, initData } from './lib/routing.js';

const main = async () => {
  await initData();
  const server = createServer();

  server.on('request', async (req, res) => {
    const { pathname, query } = parse(req.url);
    if (pathname === '/favicon.ico') return res.end();

    const queryMap = parseQuery(query);
    const [, mainMethod, ...pathList] = pathname.split('/');

    res.writeHead(200, {
      'Content-Type': 'application/json',
    });

    switch (mainMethod) {
      case '':
      case 'overview':
        await overviewHandler(res, queryMap);
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
