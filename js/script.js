const state = {
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    key: '9c50fc473f517bbfab571ebd19f1c033',
    url: 'https://api.themoviedb.org/3/',
  },
};

// Display 20 most popular movies
async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');
  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = ` 
          <a href="movie-details.html?id=${movie.id}">
          ${
            movie.poster_path
              ? `  <img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />`
              : `  <img
              src="/images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`
          }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
            <p class="card-text">
                <small class="text-muted"><i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
                  1
                )} / 10</small>
            </p>
            
          </div>
        `;

    document.querySelector('#popular-movies').appendChild(div);
  });
}

// Display 20 most popular tv shows
async function displayPopularShows() {
  const { results } = await fetchAPIData('tv/popular');
  results.forEach((show) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = ` 
          <a href="tv-details.html?id=${show.id}">
          ${
            show.poster_path
              ? `  <img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />`
              : `  <img
              src="/images/no-image.jpg"
              class="card-img-top"
              alt="${show.name}"
            />`
          }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Air date: ${show.first_air_date}</small>
            </p>
            <p class="card-text">
<small class="text-muted"><i class="fas fa-star text-secondary"></i> ${show.vote_average.toFixed(
      1
    )} / 10</small>            </p>
            
          </div>
        `;

    document.querySelector('#popular-shows').appendChild(div);
  });
}

// Display movie details
async function displayMovieDetails() {
  const movieId = window.location.search.split('=')[1];
  const movie = await fetchAPIData(`movie/${movieId}`);
  const { cast } = await fetchAPIData(`movie/${movieId}/credits`);

  // Overly for background image
  displayBackgroundImage('movie', movie.backdrop_path);

  const div = document.createElement('div');
  div.innerHTML = `  <div class="details-top">
          <div>
              ${
                movie.poster_path
                  ? `  <img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />`
                  : `  <img
              src="/images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`
              }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
             ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${
              movie.homepage
            }" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
              movie.budget
            )}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
              movie.revenue
            )}</li>
            <li><span class="text-secondary">Runtime:</span> ${
              movie.runtime
            } minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
           ${movie.production_companies
             .map((company) => `<span>${company.name}</span>`)
             .join(', ')} 
             </div>

             <div class="grid cast">
           ${cast
             .slice(0, 20)
             .map(
               (member) => `
               <div class="cast-member">

               <img
              src="https://image.tmdb.org/t/p/w300/${member.profile_path}"
              class="cast-img"
              alt="${member.name}"
             />
            <p><span class="text-secondary">Name: </span>${member.name}</p>
            <p><span class="text-secondary">Character: </span>${member.character}</p>
          </div>

  `
             )
             .join('')}
             </div>`;

  document.querySelector('#movie-details').appendChild(div);
}

// Display show details
async function displayShowDetails() {
  const showId = window.location.search.split('=')[1];
  const show = await fetchAPIData(`tv/${showId}`);

  // Overly for background image
  displayBackgroundImage('tv', show.backdrop_path);

  const div = document.createElement('div');
  div.innerHTML = `<div class="details-top">
          <div>
             ${
               show.poster_path
                 ? `  <img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />`
                 : `  <img
              src="/images/no-image.jpg"
              class="card-img-top"
              alt="${show.name}"
            />`
             }
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${show.first_air_date}</p>
            <p>
              ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${
              show.homepage
            }" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Seasons: </span> ${
              show.number_of_seasons
            }</li>
             <li><span class="text-secondary">Number Of Episodes: </span> ${
               show.number_of_episodes
             }</li>
            <li>
              <span class="text-secondary">Last Episode To Air: </span>  ${
                show.last_episode_to_air.name
              }
            </li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${show.production_companies
            .map((company) => `<span>${company.name}</span>`)
            .join(', ')}</div>
        </div>`;

  document.querySelector('#show-details').appendChild(div);
}

// Display backdrop for pages
function displayBackgroundImage(type, backgroundPath) {
  const backdropDiv = document.createElement('div');
  backdropDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  backdropDiv.classList.add('backdrop');

  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(backdropDiv);
  } else {
    document.querySelector('#show-details').appendChild(backdropDiv);
  }
}

// Display now playing movies
async function displayNowPlayingSlider() {
  const { results } = await fetchAPIData(`movie/now_playing`);

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
              <img src="https://image.tmdb.org/t/p/w500${
                movie.poster_path
              }" alt="${movie.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
                1
              )} / 10
            </h4>
    `;
    document.querySelector('.swiper-wrapper').appendChild(div);

    initSwipper();
  });
}

// Display movies recommendations
async function displayMovieRecommendations() {
  const movieId = window.location.search.split('=')[1];
  const { results } = await fetchAPIData(`movie/${movieId}/recommendations`);
  results.forEach((movie) => {
    if (movie.poster_path) {
      const div = document.createElement('div');
      div.classList.add('swiper-slide');
      div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
              <img src="https://image.tmdb.org/t/p/w500${
                movie.poster_path
              }" alt="${movie.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
                1
              )} / 10
            </h4>
    `;
      document.querySelector('.swiper-wrapper').appendChild(div);

      initSwipper();
    }
  });
}

// Display tv-show recommendations
async function displayShowRecommendations() {
  const showId = window.location.search.split('=')[1];
  const { results } = await fetchAPIData(`tv/${showId}/recommendations`);
  results.forEach((show) => {
    if (show.poster_path) {
      const div = document.createElement('div');
      div.classList.add('swiper-slide');
      div.innerHTML = `
    <a href="show-details.html?id=${show.id}">
              <img src="https://image.tmdb.org/t/p/w500${
                show.poster_path
              }" alt="${show.name}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${show.vote_average.toFixed(
                1
              )} / 10
            </h4>
    `;
      document.querySelector('.swiper-wrapper').appendChild(div);

      initSwipper();
    }
  });
}

//Swipper library
function initSwipper() {
  const swiper = new Swiper('.swiper', {
    // Optional parameters
    loop: true,
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },

    // If we need pagination
    // pagination: {
    //   el: '.swiper-pagination',
    // },

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });
}

// Fetch data form TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = state.api.key;
  const API_URL = state.api.url;

  showSpinner();
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );

  const data = await response.json();
  hideSpinner();
  return data;
}

// Search data from TMDB API
async function searchAPIData() {
  const API_KEY = state.api.key;
  const API_URL = state.api.url;

  showSpinner();

  const response = await fetch(
    `${API_URL}/search/${state.search.type}?api_key=${API_KEY}&language=en-US&query=${state.search.term}&page=${state.search.page}`
  );

  const data = await response.json();
  hideSpinner();
  return data;
}

// Search movies/shows
async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  state.search.type = urlParams.get('type');
  state.search.term = urlParams.get('search-term');
  if (state.search.term !== '' && state.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchAPIData();

    // Update search state
    state.search.page = page;
    state.search.totalResults = total_results;
    state.search.totalPages = total_pages;

    if (results.length === 0) {
      return showAlert('No results found!');
    }
    displaySearchResults(results);
    document.querySelector('#search-term').value = '';
  } else {
    return showAlert('Please enter a search term');
  }
}

// Display the results of search
function displaySearchResults(results) {
  //Clear previous results
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = ` 
          <a href="${state.search.type}-details.html?id=${result.id}">
          ${
            result.poster_path
              ? `  <img
              src="https://image.tmdb.org/t/p/w500${result.poster_path}"
              class="card-img-top"
              alt="${result.title ?? result.name}"
            />`
              : `  <img
              src="/images/no-image.jpg"
              class="card-img-top"
              alt="${result.title ?? result.name}"
            />`
          }
          </a>
          <div class="card-body">
            <h5 class="card-title">${result.title ?? result.name}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${
                result.release_date ?? result.first_air_date
              }</small>
            </p>
            <p class="card-text">
                <small class="text-muted"><i class="fas fa-star text-secondary"></i> ${result.vote_average.toFixed(
                  1
                )} / 10</small>
            </p>
            
          </div>
        `;

    document.querySelector('#search-results').appendChild(div);
  });
  document.querySelector(
    '#search-results-heading'
  ).innerHTML = `<h2>${results.length} of ${state.search.totalResults} results for <span class="text-primary">${state.search.term}</span></h2>`;
  displayPagination();
}

// Display pagination for search
function displayPagination() {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
  <button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${state.search.page} of ${state.search.totalPages} </div>
  `;
  document.querySelector('#pagination').appendChild(div);

  // Disable prev button on first page
  if (state.search.page === 1) {
    document.querySelector('#prev').disabled = true;
  }

  // Disable next button on last page
  if (state.search.page === state.search.totalPages) {
    document.querySelector('#next').disabled = true;
  }

  // Next page
  document.querySelector('#next').addEventListener('click', async () => {
    state.search.page++;
    const { results } = await searchAPIData();
    displaySearchResults(results);
  });

  // Prev page
  document.querySelector('#prev').addEventListener('click', async () => {
    state.search.page--;
    const { results } = await searchAPIData();
    displaySearchResults(results);
  });
}

function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

// Highligh active link
function highlightActiveLink() {
  const links = document.querySelectorAll('.nav-link');

  links.forEach((link) => {
    if (link.getAttribute('href') === state.currentPage) {
      link.classList.add('active');
    }
  });
}

// Show Error Alert
function showAlert(message, className = 'error') {
  const alertElement = document.createElement('div');
  alertElement.classList.add('alert', className);
  alertElement.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertElement);
  setTimeout(() => alertElement.remove(), 3000);
}

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Init App
function init() {
  // Simple router
  switch (state.currentPage) {
    case '/':
    case '/index.html':
      displayNowPlayingSlider();
      displayPopularMovies();
      break;
    case '/shows.html':
    case '/shows':
      displayPopularShows();
      break;
    case '/movie-details.html':
      displayMovieDetails();
      displayMovieRecommendations();
      break;
    case '/tv-details.html':
      displayShowDetails();
      displayShowRecommendations();
      break;
    case '/search.html':
    case '/search':
      search();
      break;
  }

  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
