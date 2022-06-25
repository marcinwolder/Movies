class moviePicker {
  constructor(id) {
    this.elementId = id;
    this.element = document.querySelector(`#${id}`);

    this.element.innerHTML = `
    <label for="filmeName">Insert Film Name</label> <br />
    <input type="text" name="filmName" id="filmName" />
    `;
    this.element.addEventListener('input', debounce(this.onInput, 500));

    document.addEventListener('click', (event) => {
      if (
        !this.element.contains(event.target) &&
        this.element.lastElementChild.classList.contains('dropdown') &&
        this.element.lastElementChild.classList.contains('is-active')
      ) {
        this.element.lastElementChild.classList.remove('is-active');
      }
    });
  }
  onChoose = async (event) => {
    event.composedPath()[4].children[2].value = event.target.innerText;
    event.composedPath()[3].classList.remove('is-active');

    this.filmInfo = await fetchData({
      i: event.target.getAttribute('data-imdbid'),
    }).then((response) => response.data);
  };
  onInput = async (event) => {
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
      option.addEventListener('click', this.onChoose);
      option.setAttribute('data-imdbid', movie.imdbID);
      option.innerHTML = `
        <img src="${movie.Poster === `N/A` ? '' : movie.Poster}">
        ${movie.Title} (${movie.Year})
      `;
      optionsList.appendChild(option);
    }
    event.target.parentElement.appendChild(dropdown);
  };
}
