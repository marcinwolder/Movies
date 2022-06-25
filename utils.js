function debounce(func, delay = 1000) {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
}

async function fetchData(params) {
  return await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'cff9ad86',
      ...params,
    },
  });
}
