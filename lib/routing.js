import {
  getItemById,
  getData,
  loadTemplate,
  tempReplace,
} from './dataHandler.js';

class APIError {
  constructor(message, code) {
    this.message = message;
    this.code = code;
  }
}

let mainData = null;
let tempOverview = null;
let tempCard = null;
let tempProduct = null;

const defaultError = new APIError('unknown Error', 0);

const initData = async () => {
  mainData = await getData();
  console.log('loaded');

  tempOverview = await loadTemplate('overview.html');
  tempCard = await loadTemplate('card.html');
  tempProduct = await loadTemplate('product.html');

  console.log('templates loaded');
};

const overviewHandler = async (res, query) => {
  let statusCode = 200;
  let responseData = null;

  const { id: index } = query;

  if (index) {
    const item = await getItemById(index, mainData);
    responseData = tempReplace(tempProduct, item);
  } else {
    const cardsData = {};
    cardsData.cards = mainData.map(el => tempReplace(tempCard, el)).join('');
    responseData = tempReplace(tempOverview, cardsData);
  }
  res.writeHead(statusCode, {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'no-cache',
  });

  res.end(responseData);
};

const apiHandler = async (res, [method, ...args]) => {
  let statusCode = 200;
  let responseData = null;

  switch (method) {
    case 'id':
      const index = args[0];
      if (!index) {
        statusCode = 404;
        responseData = new APIError('please input an index value', 300);
        break;
      }
      const data = await getItemById(index, mainData);
      if (!data) {
        statusCode = 404;
        responseData = new APIError(`can not found ${index}`, 404);
        break;
      }
      responseData = data;
      break;
    default:
      responseData = mainData;
  }

  res.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-cache',
  });
  res.end(JSON.stringify(responseData || defaultError));
};

export { apiHandler, overviewHandler, initData };
