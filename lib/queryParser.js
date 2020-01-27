const parseQuery = query => {
  if (!query || typeof query !== 'string') return new Map();

  const splitted = query
    .split('&')
    .filter(p => !!p)
    .map(q => {
      const [key, value] = q.split('=');
      return [key, value || true];
    });

  return new Map(splitted);
};

export { parseQuery };
