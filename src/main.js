const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMzNmN2FiM2U1NmY4NWZhMjk0ZDA3NTAwYjA4MDMxNSIsInN1YiI6IjY1ODZmOTczNjg4Y2QwNTdiMjg0NWVjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1fm9pVN88bHuSK0847BtkutbvTr80nvL8-nkNrVJ9vw'
  },
});

async function getTrendingMoviesPreview() {
  try{
    const {data} = await api('trending/movie/day');
    const movies = data.results;

    trendingMoviesPreviewList.innerHTML = '';


    movies.forEach(movie => {
      const movieContainer = document.createElement('div');
      movieContainer.classList.add('movie-container');

      const movieImg = document.createElement('img');
      movieImg.classList.add('movie-img');
      movieImg.setAttribute('alt', movie.title);
      movieImg.setAttribute('src', `https://image.tmdb.org/t/p/w500${movie.poster_path}`);
      
      movieContainer.appendChild(movieImg);
      trendingMoviesPreviewList.appendChild(movieContainer);
      });

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

    categoriesPreviewList.innerHTML = '';

    categories.forEach(category => {
      const categoryContainer = document.createElement('div');
      categoryContainer.classList.add('category-container');

      const categoryTitle = document.createElement('h3');
      categoryTitle.classList.add('category-title');
      categoryTitle.setAttribute('id', `id${category.id}`);
      const categoryTitleText = document.createTextNode(category.name);

      categoryTitle.appendChild(categoryTitleText);
      categoryContainer.appendChild(categoryTitle);
      categoriesPreviewList.appendChild(categoryContainer);
      });

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
