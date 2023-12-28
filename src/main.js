const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMzNmN2FiM2U1NmY4NWZhMjk0ZDA3NTAwYjA4MDMxNSIsInN1YiI6IjY1ODZmOTczNjg4Y2QwNTdiMjg0NWVjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1fm9pVN88bHuSK0847BtkutbvTr80nvL8-nkNrVJ9vw'
  },
});

// Utils

const lazyLoader = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const url = entry.target.getAttribute('data-img');
      entry.target.setAttribute('src', url);
    }
  })
});

function createmovies(
    movies,
    container,
    {
      lazyLoad = false,
      clean = true
    } = {}
  ) {
  if (clean) {
    container.innerHTML = ''; 
  }

  movies.forEach(movie => {
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');

    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.setAttribute('alt', movie.title);
    movieImg.setAttribute(lazyLoad ? 'data-img' : 'src', `https://image.tmdb.org/t/p/w500${movie.poster_path}`);
    movieImg.addEventListener('error', () => {
      movieImg.style.display= "none";
    });
    movieImg.addEventListener('click', () => {
      location.hash = '#movie=' + movie.id;
    })

    const movieBtn = document.createElement('botton');
    movieBtn.classList.add('movie-btn');
    movieBtn.addEventListener('click', () => {
      movieBtn.classList.toggle('movie-btn--liked');
    });

    if (lazyLoad) {
      lazyLoader.observe(movieImg);
    }
    
    movieContainer.appendChild(movieImg);
    movieContainer.appendChild(movieBtn);
    container.appendChild(movieContainer);
  });
}

function createCategories(categories, container) {
  container.innerHTML = '';

  categories.forEach(category => {
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category-container');

    const categoryTitle = document.createElement('h3');
    categoryTitle.classList.add('category-title');
    categoryTitle.setAttribute('id', `id${category.id}`);
    categoryTitle.addEventListener('click', () => {
      location.hash = `#category=${category.id}-${category.name}`
    });
    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  });
}

//Llamados a la API

window.addEventListener('scroll', getPaginatedTrendingMovies);

async function getTrendingMoviesPreview() {
  try{
    const {data} = await api('trending/movie/day');
    const movies = data.results;

    createmovies(movies, trendingMoviesPreviewList, true);

  } catch (error) {
    // Aquí manejas el error
    if (error.response) {
      // La solicitud fue realizada y el servidor respondió con un código de estado fuera del rango 2xx
      console.error('Respuesta del servidor con error:', error.response.data);
      console.error('Código de estado:', error.response.status);
    } else if (error.request) {
      // La solicitud fue realizada pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor');
    } else {
      // Ocurrió un error al configurar la solicitud
      console.error('Error al configurar la solicitud:', error.message);
    }
  }
}

async function getCategoriesPreview() {
  try{
    const {data} = await api('genre/movie/list');
    const categories = data.genres;

    createCategories(categories, categoriesPreviewList);

  } catch (error) {
    // Aquí manejas el error
    if (error.response) {
      // La solicitud fue realizada y el servidor respondió con un código de estado fuera del rango 2xx
      console.error('Respuesta del servidor con error:', error.response.data);
      console.error('Código de estado:', error.response.status);
    } else if (error.request) {
      // La solicitud fue realizada pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor');
    } else {
      // Ocurrió un error al configurar la solicitud
      console.error('Error al configurar la solicitud:', error.message);
    }
  }
}

function getPaginatedMoviesByCategory(id) {
  return async function () {
    try{
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  
      const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight -15);
      const pageIsNotMax = page < maxPage;
  
      if (scrollIsBottom && pageIsNotMax) {
        page++
        const {data} = await api('discover/movie', {
          params: {
            with_genres: id,
            page,
          },
        });
        const movies = data.results;
  
        createmovies(movies, genericSection, {lazyLoad: true, clean: false});
      }
  
    } catch (error) {
      // Aquí manejas el error
      if (error.response) {
        // La solicitud fue realizada y el servidor respondió con un código de estado fuera del rango 2xx
        console.error('Respuesta del servidor con error:', error.response.data);
        console.error('Código de estado:', error.response.status);
      } else if (error.request) {
        // La solicitud fue realizada pero no se recibió respuesta
        console.error('No se recibió respuesta del servidor');
      } else {
        // Ocurrió un error al configurar la solicitud
        console.error('Error al configurar la solicitud:', error.message);
      }
    }
  }
}

async function getMoviesByCategory(id) {
  try{
    const {data} = await api('discover/movie', {
      params: {
        with_genres: id,
      },
    });
    const movies = data.results;
    maxPage = data.total_pages;

    createmovies(movies, genericSection, {lazyLoad: true});

  } catch (error) {
    // Aquí manejas el error
    if (error.response) {
      // La solicitud fue realizada y el servidor respondió con un código de estado fuera del rango 2xx
      console.error('Respuesta del servidor con error:', error.response.data);
      console.error('Código de estado:', error.response.status);
    } else if (error.request) {
      // La solicitud fue realizada pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor');
    } else {
      // Ocurrió un error al configurar la solicitud
      console.error('Error al configurar la solicitud:', error.message);
    }
  }
}

async function getMoviesBySearch(query) {
  try{
    const {data} = await api('search/movie', {
      params: {
        query,
      },
    });
    const movies = data.results;
    maxPage = data.total_pages;

    createmovies(movies, genericSection);

  } catch (error) {
    // Aquí manejas el error
    if (error.response) {
      // La solicitud fue realizada y el servidor respondió con un código de estado fuera del rango 2xx
      console.error('Respuesta del servidor con error:', error.response.data);
      console.error('Código de estado:', error.response.status);
    } else if (error.request) {
      // La solicitud fue realizada pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor');
    } else {
      // Ocurrió un error al configurar la solicitud
      console.error('Error al configurar la solicitud:', error.message);
    }
  }
}

function getPaginatedMoviesBySearch(query) {
  return async function () {
    try{
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  
      const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight -15);
      const pageIsNotMax = page < maxPage;
  
      if (scrollIsBottom && pageIsNotMax) {
        page++
        const {data} = await api('search/movie', {
          params: {
            query,
            page,
          },
        });
        const movies = data.results;
  
        createmovies(movies, genericSection, {lazyLoad: true, clean: false});
      }
  
    } catch (error) {
      // Aquí manejas el error
      if (error.response) {
        // La solicitud fue realizada y el servidor respondió con un código de estado fuera del rango 2xx
        console.error('Respuesta del servidor con error:', error.response.data);
        console.error('Código de estado:', error.response.status);
      } else if (error.request) {
        // La solicitud fue realizada pero no se recibió respuesta
        console.error('No se recibió respuesta del servidor');
      } else {
        // Ocurrió un error al configurar la solicitud
        console.error('Error al configurar la solicitud:', error.message);
      }
    }
  }
}

async function getTrendingMovies() {
  try{
    const {data} = await api('trending/movie/day');
    const movies = data.results;
    maxPage = data.total_pages;

    createmovies(movies, genericSection, {lazyLoad: true, clean: true});

  } catch (error) {
    // Aquí manejas el error
    if (error.response) {
      // La solicitud fue realizada y el servidor respondió con un código de estado fuera del rango 2xx
      console.error('Respuesta del servidor con error:', error.response.data);
      console.error('Código de estado:', error.response.status);
    } else if (error.request) {
      // La solicitud fue realizada pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor');
    } else {
      // Ocurrió un error al configurar la solicitud
      console.error('Error al configurar la solicitud:', error.message);
    }
  }
}

async function getMovieById(id) {
  try{
    const {data: movie} = await api('movie/' + id);

    const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    headerSection.style.background = `
      linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.35) 19.27%,
        rgba(0, 0, 0, 0) 29.17%
      ),
      url(${movieImgUrl})
    `;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres, movieDetailCategoriesList)

    getRelateMoviesId(id)

  } catch (error) {
    // Aquí manejas el error
    if (error.response) {
      // La solicitud fue realizada y el servidor respondió con un código de estado fuera del rango 2xx
      console.error('Respuesta del servidor con error:', error.response.data);
      console.error('Código de estado:', error.response.status);
    } else if (error.request) {
      // La solicitud fue realizada pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor');
    } else {
      // Ocurrió un error al configurar la solicitud
      console.error('Error al configurar la solicitud:', error.message);
    }
  }
}

async function getRelateMoviesId(id) {
  const {data} = await api(`movie/${id}/recommendations`);
  const relatedMovie = data.results;

  createmovies(relatedMovie, relatedMoviesContainer);
}

async function getPaginatedTrendingMovies() {
  try{
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight -15);
    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
      page++
      const {data} = await api('trending/movie/day', {
        params: {
          page
        },
      });
      const movies = data.results;

      createmovies(movies, genericSection, {lazyLoad: true, clean: false});
    }

  } catch (error) {
    // Aquí manejas el error
    if (error.response) {
      // La solicitud fue realizada y el servidor respondió con un código de estado fuera del rango 2xx
      console.error('Respuesta del servidor con error:', error.response.data);
      console.error('Código de estado:', error.response.status);
    } else if (error.request) {
      // La solicitud fue realizada pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor');
    } else {
      // Ocurrió un error al configurar la solicitud
      console.error('Error al configurar la solicitud:', error.message);
    }
  }
}