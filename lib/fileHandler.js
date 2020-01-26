import fs from 'fs';
const { readFile, writeFile } = fs.promises;

const getJSON = async url => {
  const data = await readFile(url, 'utf-8');

  let result = null;
  try {
    result = JSON.parse(data);
  } catch (e) {
    if (e.name === 'SyntaxError') return {};
    throw e;
  }

  return result;
};

const setJSON = async (url, data) => {
  let json = {};

  try {
    json = JSON.stringify(data, null, 2);
  } catch {
    json = '{}';
  }

  await writeFile(url, data, 'utf-8');
};

const getFile = async url => await readFile(url, 'utf-8');
const setFile = async (url, data) => await writeFile(url, data, 'utf-8');

export { getJSON, setJSON, getFile, setFile };
