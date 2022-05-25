"use strict"

const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185"
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780"
const CONTAINER = document.querySelector("#movies")

const HOME = document.getElementById("home")
const LOGO = document.getElementById("logo")
const ACTION = document.getElementById("action")
const SCIFI = document.getElementById("scifi")
const COMEDY = document.getElementById("comedy")
const DRAMA = document.getElementById("drama")
const DOCUMENTARY = document.getElementById("documentary")
const ACTORS = document.getElementById("actorsList")


// Turns genre_id into genre word
function showGenre(genre_id) {
    switch (genre_id) {
        case 28:
            return "Action"
            break
        case 878:
            return "Sci-Fi"
            break
        case 35:
            return "Comedy"
            break
        case 18:
            return "Drama"
            break
        case 99:
            return "Documentary"
            break
        default:
            return "N/A"
    }
}
function showGender(num) {
    switch (num) {
        case 1:
            return "Female"
            break
        case 2:
            return "Male"
            break
        default:
            return "N/A"
    }
}

// Don't touch this function please
const autorun = async () => {
    const movies = await fetchMovies()
    renderMovies(movies.results)
}
const listActors = async () => {
    const actors = await fetchActors()
    renderActors(actors.results)
}

// Don't touch this function please
const constructUrl = (path) => {
    return `${TMDB_BASE_URL}/${path}?api_key=${atob(
        "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
    )}`
}

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
    const movieRes = await fetchMovie(movie.id)
    const castRes = await fetchCast(movie.id)
    const similar = await fetchSim(movie.id)
    const trailer = await fetchTrailer(movie.id)
    renderMovie(movieRes, castRes, similar, trailer)
}
const personDetails = async (actor) => {
    const person = await fetchPerson(actor.id)
    const personMovies = await fetchPersonMovies(actor.id)
    renderActor(actor, person, personMovies)
}

const genreMovieDetails = async (genreId) => {
    const genre = await fetchGenreMovies(genreId)
    console.log(genre)
    renderMovies(genre.results)
}

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
    const url = constructUrl(`movie/now_playing`)
    const res = await fetch(url)
    return res.json()
}

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
    const url = constructUrl(`movie/${movieId}`)
    const res = await fetch(url)
    return res.json()
}
const fetchCast = async (movieId) => {
    const url = constructUrl(`movie/${movieId}/credits`)
    const res = await fetch(url)
    return res.json()
}

const fetchSim = async (movieId) => {
    const url = constructUrl(`movie/${movieId}/similar`)
    const res = await fetch(url)
    return res.json()
}
const fetchTrailer = async (movieId) => {
    const url = constructUrl(`movie/${movieId}/videos`)
    const res = await fetch(url)
    return res.json()
}
const fetchPerson = async (personId) => {
    const url = constructUrl(`person/${personId}`)
    const res = await fetch(url)
    return res.json()
}
const fetchPersonMovies = async (personId) => {
    const url = constructUrl(`person/${personId}/movie_credits`)
    const res = await fetch(url)
    return res.json()
}
const fetchGenreMovies = async (genreId) => {
    const url = constructUrl(`discover/movie`) + "&with_genres=" + genreId
    const res = await fetch(url)
    return res.json()
}
const fetchActors = async () => {
    const url = constructUrl(`person/popular`)
    const res = await fetch(url)
    return res.json()
}

// this function lists all popular actors
const renderActors= (actors) => {
    console.log(actors);
    actors.map((actor) => {
        const actorDiv = document.createElement("div")
        actorDiv.classList =
            "col-lg-3 col-md-4 col-sm-12 m-3 p-0 rounded d-flex flex-column actor-poster"
        actorDiv.innerHTML = `
    <img src="${PROFILE_BASE_URL + actor.profile_path}" alt="${
            actor.name
        } poster">
    <h3>${actor.name}</h3>`
        actorDiv.addEventListener("click", () => {
            personDetails(actor)
        })
        CONTAINER.appendChild(actorDiv)
    })
}

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
    movies.map((movie, index) => {
        //console.log(movie);
        const movieDiv = document.createElement("div")
        movieDiv.classList =
            "col-lg-3 col-md-4 col-sm-12 m-3 p-0 rounded d-flex flex-column movie-poster"
        movieDiv.innerHTML = `
    <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
            movie.title
        } poster" class="movie-box">
    <div class="movie-info">
      <p>Genre: ${showGenre(movie.genre_ids[0])}</p>
      <p>Rating: ${movie.vote_average}</p>
      <p class="desc">Overview: ${movie.overview.slice(0, 200)}...</p>
    </div>
    <h3>${movie.title}</h3>`
        movieDiv.addEventListener("click", () => {
            movieDetails(movie)
        })
        CONTAINER.appendChild(movieDiv)
    })
}

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie, cast, simmovies, trailers) => {
    // console.log(cast)
    // console.log(movie)
    // console.log(simmovies)
    // console.log(trailers)
    console.log(Object.values(cast.crew))
    let crew = Object.values(cast.crew)
    let director = ""
    for (let i = 0; i < crew.length; i++) {
        if (crew[i].job === "Director") {
            director = crew[i].name
        }
    }
    console.log(director)
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
    <div class="row m-5">
        <div class="col-md-4">
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled">
              <li><button id="0">${cast.cast[0].name}</button></li>
              <li><button id="1">${cast.cast[1].name}</button></li>
              <li><button id="2">${cast.cast[2].name}</button></li>
              <li><button id="3">${cast.cast[3].name}</button></li>
              <li><button id="4">${cast.cast[4].name}</button></li>
            </ul>
        </div>
        <div class="col-md-4">
            <h3>Language: ${movie.original_language}</h3>
            <h3>Production Company: ${movie.production_companies[0].name}</h3>
            <img src="${BACKDROP_BASE_URL}${
        movie.production_companies[0].logo_path
    }">
        </div>
        <div class="col-md-4">
        <h3>Similar Movies:</h3>
        <ul id="simmovies" class="list-unstyled">
        <li>${simmovies.results[0].title}</li>
        <li>${simmovies.results[1].title}</li>
        <li>${simmovies.results[2].title}</li>
        <li>${simmovies.results[3].title}</li>
        <li>${simmovies.results[4].title}</li>
   
        </ul>
        </div>
    </div>
    <div class="row">
      <div class="col-md-8">
        <h3>Trailer:</h3>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${
            trailers.results[0].key
        }"
         title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
        </iframe>
      </div>
      <div class="col-md-4">
        <h3>Director: ${director}</h3>
        <h3>Movie Rating:</h3>
        <p>Rating: ${movie.vote_average}</p>
        <p>Total votes: ${movie.vote_count}</p>
      </div>
    </div>`
    let actorLinks = document.getElementsByTagName("button")
    for (let i = 0; i < actorLinks.length; i++) {
        actorLinks[i].addEventListener("click", () => {
            personDetails(cast.cast[actorLinks[i].id])
        })
    }
}

const renderActor = (actor, person, personMovies) => {
    CONTAINER.innerHTML = `
  <div class="row">
    <div class="col-sm-4">
      <img src="${PROFILE_BASE_URL + actor.profile_path}">
      <h3>${actor.name}</h3>
      <h3>Gender: ${showGender(actor.gender)}</h3>
      <h3>Popularity: ${actor.popularity}</h3>
      <h3>Birthday: ${person.birthday}</h3>
      <h3>Deathday: ${person.deathday}</h3>
    </div>
    <div class="col-sm-8">
      <h3>Biography</h3>
      <p>${person.biography}</p>
    </div>
  </div>
  <div class="row m-5">
    <h3>Actor's Movies: </h3>
    <ul>
      <li>${personMovies.cast[0].title}</li>
      <li>${personMovies.cast[1].title}</li>
      <li>${personMovies.cast[2].title}</li>
      <li>${personMovies.cast[3].title}</li>
      <li>${personMovies.cast[4].title}</li>
    </ul>
  </div>
  `
}
HOME.addEventListener("click", () => {
    CONTAINER.innerHTML = ""
    autorun()
})
LOGO.addEventListener("click", () => {
    CONTAINER.innerHTML = ""
    autorun()
})
ACTION.addEventListener("click", () => {
    CONTAINER.innerHTML = ""
    genreMovieDetails(28)
})
SCIFI.addEventListener("click", () => {
    CONTAINER.innerHTML = ""
    genreMovieDetails(878)
})
COMEDY.addEventListener("click", () => {
    CONTAINER.innerHTML = ""
    genreMovieDetails(35)
})
DRAMA.addEventListener("click", () => {
    CONTAINER.innerHTML = ""
    genreMovieDetails(18)
})
DOCUMENTARY.addEventListener("click", () => {
    CONTAINER.innerHTML = ""
    genreMovieDetails(99)
})
ACTORS.addEventListener("click", () => {
    CONTAINER.innerHTML = ""
    listActors();
})
document.addEventListener("DOMContentLoaded", autorun)
