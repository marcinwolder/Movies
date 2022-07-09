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
  movieTemplate = movieDetail => {
    return `
      <article class="media">
        <figure class="media-left">
          <p class="image">
            <img src="${movieDetail.Poster}" />
          </p>
        </figure>
        <div class="media-content">
          <div class="content">
            <h1>${movieDetail.Title}</h1>
            <h4>${movieDetail.Genre}</h4>
            <p>${movieDetail.Plot}</p>
          </div>
        </div>
      </article>
      <article class="notification is-primary">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
      </article>
      <article class="notification is-primary">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
      </article>
      <article class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
      </article>
      <article class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
      </article>
      <article class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
      </article>
    `;
  };
  onChoose = async (event) => {
    event.composedPath()[4].children[2].value = event.target.innerText;
    event.composedPath()[3].classList.remove('is-active');

    this.filmInfo = await fetchData({
      i: event.target.getAttribute('data-imdbid'),
    }).then((response) => response.data);

    const filmSummary = document.createElement('div');
    filmSummary.innerHTML = this.movieTemplate(this.filmInfo);
    this.element.append(filmSummary);
    this.filmSummary = filmSummary;
  };
  onInput = async (event) => {
    const result = await fetchData({ s: event.target.value }).then(
      (result) => result.data
    );
    if (result.Error) return;

    const parent = event.target.parentElement;

    const parentChildren = [...parent.children];
    if(parentChildren.includes(this.dropdown)){
      parentChildren[parentChildren.indexOf(this.dropdown)].remove();
    }
    if(parentChildren.includes(this.filmSummary)){
      parentChildren[parentChildren.indexOf(this.filmSummary)].remove();
    }

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
    this.dropdown = dropdown;
  };
}
