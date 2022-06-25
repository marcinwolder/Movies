const autocomplete = document.querySelectorAll('.autocomplete');

const onChoose = async (event) => {
  event.composedPath()[4].children[2].value = event.target.innerText;
  event.composedPath()[3].classList.remove('is-active');

  const moreInfo = await fetchData({
    i: event.target.getAttribute('data-imdbid'),
  }).then((response) => response.data);
  console.log(moreInfo);
};

const onInput = async (event) => {
  const result = await fetchData({ s: event.target.value }).then(
    (result) => result.data
  );

  const parent = event.target.parentElement;
  const lastElementOfStack = parent.lastElementChild;
  if (lastElementOfStack.classList.contains('dropdown')) {
    lastElementOfStack.remove();
  }
  if (result.Error) return;

  const dropdown = document.createElement('div');
  const addClasses = Array(...parent.classList).slice(1);
  dropdown.classList.add('dropdown', 'is-active', ...addClasses);
  dropdown.innerHTML = `
  <div class="dropdown-menu">
    <div class="dropdown-content"></div>
  </div>`;

  const optionsList = dropdown.lastElementChild.lastElementChild;
  for (const movie of result.Search) {
    const option = document.createElement('a');
    option.classList.add('dropdown-item');
    option.addEventListener('click', onChoose);
    option.setAttribute('data-imdbid', movie.imdbID);
    option.innerHTML = `
      <img src="${movie.Poster === `N/A` ? '' : movie.Poster}">
      ${movie.Title} (${movie.Year})
    `;
    optionsList.appendChild(option);
  }

  event.target.parentElement.appendChild(dropdown);
};

//Basic div structure
autocomplete.forEach((x) => {
  x.innerHTML = `
  <label for="filmeName">Insert Film Name</label> <br />
  <input type="text" name="filmName" id="filmName" />
  `;
  x.addEventListener('input', debounce(onInput, 500));
});

//Autocomplete hides after lost focus
document.addEventListener('click', (event) => {
  autocomplete.forEach((x) => {
    if (
      !x.contains(event.target) &&
      x.lastElementChild.classList.contains('dropdown') &&
      x.lastElementChild.classList.contains('is-active')
    ) {
      x.lastElementChild.classList.remove('is-active');
    }
  });
});
