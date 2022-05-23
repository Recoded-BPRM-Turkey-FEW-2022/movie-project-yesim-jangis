'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector("#movies");

// Turns genre_id into genre word
function showGenre(genre_id) {
  switch(genre_id) {
    case 28:
      return "Action";
      break;
    case 878:
      return "Sci-Fi";
      break;
    case 35:
      return "Comedy";
      break;
    case 18:
      return "Drama";
      break;
    case 99:
      return "Documentary";
      break;
    default:
      return "N/A";
  }
}

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  const castRes = await fetchCast(movie.id);
  renderMovie(movieRes,castRes);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};
const fetchCast = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/credits`);
  const res = await fetch(url);
  return res.json();
};



// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  movies.map((movie,index) => {
    //console.log(movie);
    const movieDiv = document.createElement("div");
    movieDiv.classList = ("col-lg-3 col-md-4 col-sm-12 m-3 p-0 rounded d-flex flex-column movie-poster");
    movieDiv.innerHTML = `
    <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title} poster" class="movie-box">
    <div class="movie-info">
      <p>Genre: ${showGenre(movie.genre_ids[0])}</p>
      <p>Rating: ${movie.vote_average}</p>
      <p class="desc">Overview: ${movie.overview.slice(0,200)}...</p>
    </div>
    <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie,cast) => {
  console.log(cast)
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled">
              <li>${cast.cast[0].name}</li>
              <li>${cast.cast[1].name}</li>
              <li>${cast.cast[2].name}</li>
              <li>${cast.cast[3].name}</li>
              <li>${cast.cast[4].name}</li>
            </ul>
    </div>`;
  // fetch(constructUrl(`movie/${movie.id}/credits`))
  // .then((response) => response.json())
  // .then((json) => {
  //   for (let i = 0; i < 5; i++) {
  //     actor1.push(json.cast[i].name);
  //     console.log(json.cast[i].name);
  //   }
  // });
  // document.getElementById("actors").innerHTML = actor1;
  // console.log(actor1);
};




// const fetchMovieActors = async (movieId) => {
//   const url = constructUrl(`movie/${movieId}/credits`);
//   const res = await fetch(url);
//   return res.json();
// };
// const movieActors = async () => {
//   const movieRes = await fetchMovieActors(678287);
//   return movieRes;
// };
// const movieActorName = (movie) => {
//   let actors = [];
//   for (let i = 0; i < 5; i++) {
//     actors.push(movie)
//   }
//   return actors;
// }
// let actor = movieActors();
// console.log(actor[["PromiseResult"]]);

document.addEventListener("DOMContentLoaded", autorun);
