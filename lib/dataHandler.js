import { getJSON, setJSON, getFile } from './fileHandler.js';
import { resolve } from 'path';
import { getPathNames } from 'esm-pathnames';

const { __dirname } = getPathNames(import.meta);
const dataPath = resolve(__dirname, '../dev-data/data.json');
const tempDirPath = resolve(__dirname, '../templates/');

const getData = async () => await getJSON(dataPath);
const setData = async data => await setJSON(dataPath, data);
const loadTemplate = async name => await getFile(resolve(tempDirPath, name));

const getItemById = async (id, memData) => {
  const data = memData ? memData : await getData();
  if (!Array.isArray(data)) return null;

  return data.find(one => one.id == id) || null;
};

const tempReplace = (temp, data) => {
  let result = temp;
  for (const [key, value] of Object.entries(data)) {
    const pattern = new RegExp(`{${key}}`, 'gi');
    result = result.replace(pattern, value);
  }
  return result;
};

export { getItemById, getData, loadTemplate, tempReplace };
