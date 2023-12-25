async function getTrendingMoviesPreview() {
  try{
    const res = await fetch('https://api.themoviedb.org/3/trending/movie/day', {
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMzNmN2FiM2U1NmY4NWZhMjk0ZDA3NTAwYjA4MDMxNSIsInN1YiI6IjY1ODZmOTczNjg4Y2QwNTdiMjg0NWVjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1fm9pVN88bHuSK0847BtkutbvTr80nvL8-nkNrVJ9vw'
      }
    });

    if (!res.ok) {
      throw new Error('Error cargando los datos');
    };

    const data = await res.json();

    const movies = data.results;
    movies.forEach(movie => {
      const trendingPreviewMoviesContainer = document.querySelector('#trendingPreview .trendingPreview-movieList');

      const movieContainer = document.createElement('div');
      movieContainer.classList.add('movie-container');

      const movieImg = document.createElement('img');
      movieImg.classList.add('movie-img');
      movieImg.setAttribute('alt', movie.title);
      movieImg.setAttribute('src', `https://image.tmdb.org/t/p/w500${movie.poster_path}`);
      
      movieContainer.appendChild(movieImg);
      trendingPreviewMoviesContainer.appendChild(movieContainer);
      });

  } catch(error) {
    console.error(error);
  }
}

async function getCategoriesPreview() {
  try{
    const res = await fetch('https://api.themoviedb.org/3/genre/movie/list', {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMzNmN2FiM2U1NmY4NWZhMjk0ZDA3NTAwYjA4MDMxNSIsInN1YiI6IjY1ODZmOTczNjg4Y2QwNTdiMjg0NWVjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1fm9pVN88bHuSK0847BtkutbvTr80nvL8-nkNrVJ9vw'
      }
    });

    if (!res.ok) {
      throw new Error('Error cargando los datos');
    };

    const data = await res.json();

    const categories = data.genres;
    categories.forEach(category => {
      const previewCategoriesContainer = document.querySelector('#categoriesPreview .categoriesPreview-list');

      const categoryContainer = document.createElement('div');
      categoryContainer.classList.add('category-container');

      const categoryTitle = document.createElement('h3');
      categoryTitle.classList.add('category-title');
      categoryTitle.setAttribute('id', `id${category.id}`);
      const categoryTitleText = document.createTextNode(category.name);

      categoryTitle.appendChild(categoryTitleText);
      categoryContainer.appendChild(categoryTitle);
      previewCategoriesContainer.appendChild(categoryContainer);
      });

  } catch(error) {
    console.error(error);
  }
}

getTrendingMoviesPreview();
getCategoriesPreview();