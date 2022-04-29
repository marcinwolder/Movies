async function fetchData(params) {
  const result = await axios.get('http://www.omdbapi.com/', {
    params: { ...params, apikey: 'cff9ad86' },
  });
  return result;
}

// const firstFilm = fetchData({ s: 'spiderman' }).then((x) => x.data.Search);
// firstFilm.then((data) => {
//   console.log(data);
// });

let result;
(async function () {
  result = await fetchData({ s: 'avengers' }).then((data) => data);
})();

const filmName = document.querySelector('#filmName');

let timeoutId;
filmName.addEventListener('input', (event) => {
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    console.log(event.target.value);
  }, 500);
});
