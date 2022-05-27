"use strict"

// declaring const URLs for API, Images, and Container
const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185"
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780"
const CONTAINER = document.querySelector("#movies")

// declaring const for navbar elements
const HOME = document.getElementById("home")
const LOGO = document.getElementById("logo")
const ACTION = document.getElementById("action")
const SCIFI = document.getElementById("scifi")
const COMEDY = document.getElementById("comedy")
const DRAMA = document.getElementById("drama")
const DOCUMENTARY = document.getElementById("documentary")
const ACTORS = document.getElementById("actorsList")
const POPULAR = document.getElementById("popular")
const RELEASE = document.getElementById("release")
const TOPRATED = document.getElementById("topRated")
const NOWPLAYING = document.getElementById("nowPlaying")
const UPCOMING = document.getElementById("upComing")
const ABOUT = document.getElementById("about")

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

//Turns gender_id into gender word
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

// Don't touch this function please OR I WILL KILL YOU!
const autorun = async () => {
    const movies = await fetchMovies()
    renderMovies(movies.results)
}
// lists popular actors in container
const listActors = async () => {
    const actors = await fetchActors()
    renderActors(actors.results)
}
// lists popular movies in container
const listPopular = async () => {
    const movies = await fetchPopular()
    renderMovies(movies.results)
}
// lists newest release movies
const listRelease = async () => {
    const movies = await fetchRelease()
    renderMovies(movies.results)
}
// lists top rated movies
const listTopRated = async () => {
    const movies = await fetchTopRated()
    renderMovies(movies.results)
}
// lists upcoming movies
const listUpComing = async () => {
    const movies = await fetchUpComing()
    renderMovies(movies.results)
}
// lists movies now playing in theaters
const listNowPlaying = async () => {
    const movies = await fetchNowPlaying()
    renderMovies(movies.results)
}

// Don't touch this function please OR I WILL KILL YOU!
const constructUrl = (path) => {
    return `${TMDB_BASE_URL}/${path}?api_key=${atob(
        "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
    )}`
}

// You may need to add to this function, definitely don't delete it.
// movieDetails uses movie, cast, similar movie, and trailer information
const movieDetails = async (movie) => {
    const movieRes = await fetchMovie(movie.id)
    const castRes = await fetchCast(movie.id)
    const similar = await fetchSim(movie.id)
    const trailer = await fetchTrailer(movie.id)
    renderMovie(movieRes, castRes, similar, trailer)
}
// uses person and personMovies objects to list single actor's detail page
const personDetails = async (actor) => {
    const person = await fetchPerson(actor.id)
    const personMovies = await fetchPersonMovies(actor.id)
    renderActor(actor, person, personMovies)
}
// this function displays top rated movies of a genre
const genreMovieDetails = async (genreId) => {
    const genre = await fetchGenreMovies(genreId)
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
// This function fetches the credits for a movie.
const fetchCast = async (movieId) => {
    const url = constructUrl(`movie/${movieId}/credits`)
    const res = await fetch(url)
    return res.json()
}
// This function fetches similar movies to a specific movie
const fetchSim = async (movieId) => {
    const url = constructUrl(`movie/${movieId}/similar`)
    const res = await fetch(url)
    return res.json()
}
// This function fetches trailers for a movie
const fetchTrailer = async (movieId) => {
    const url = constructUrl(`movie/${movieId}/videos`)
    const res = await fetch(url)
    return res.json()
}
// This function fetches a single person, whether in production or casting
const fetchPerson = async (personId) => {
    const url = constructUrl(`person/${personId}`)
    const res = await fetch(url)
    return res.json()
}
// This function fetch a person's movie
const fetchPersonMovies = async (personId) => {
    const url = constructUrl(`person/${personId}/movie_credits`)
    const res = await fetch(url)
    return res.json()
}
// This function fetches movies of a genre
const fetchGenreMovies = async (genreId) => {
    const url = constructUrl(`discover/movie`) + "&with_genres=" + genreId
    const res = await fetch(url)
    return res.json()
}
// This function fetches popular persons. Could be better if it only fetched actors.
const fetchActors = async () => {
    const url = constructUrl(`person/popular`)
    const res = await fetch(url)
    return res.json()
}
// This function fetches the most popular movies
const fetchPopular = async () => {
    const url = constructUrl(`movie/popular`)
    const res = await fetch(url)
    return res.json()
}
// This function fetches trending movies of the week. Could be better if it fetched movies by release date.
const fetchRelease = async () => {
    const url = constructUrl(`trending/movie/week`)
    const res = await fetch(url)
    return res.json()
}
// This function fetches top rated movies of ALL TIME
const fetchTopRated = async () => {
    const url = constructUrl(`movie/top_rated`)
    const res = await fetch(url)
    return res.json()
}
// This function fetches upcoming movies
const fetchUpComing = async () => {
    const url = constructUrl(`movie/upcoming`)
    const res = await fetch(url)
    return res.json()
}
// This function fetches movies newly in theaters
const fetchNowPlaying = async () => {
    const url = constructUrl(`movie/now_playing`)
    const res = await fetch(url)
    return res.json()
}

// this function places all popular actors into the container in HTML
const renderActors = (actors) => {
    CONTAINER.classList = "d-flex flex-wrap justify-content-around flame"
    // actors is an array of actors. This map method takes each item in that array, and puts it on the screen.
    actors.map((actor) => {
        const actorDiv = document.createElement("div")
        actorDiv.classList = "m-3 p-0 rounded d-flex flex-column actor-poster"
        actorDiv.innerHTML = `
        <img id="actor-size" 
             class="rounded-3"
             src="${PROFILE_BASE_URL + actor.profile_path}" 
             alt="${actor.name} poster">
        <h3 class="movie-title-hell">${actor.name}</h3>`
        // when you click on the actor name, you will see the actor details
        actorDiv.addEventListener("click", () => {
            personDetails(actor)
        })
        CONTAINER.appendChild(actorDiv)
    })
}

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
    CONTAINER.classList = "container-content container-fluid d-flex flex-row flex-wrap justify-content-center text-center pt-4"
    CONTAINER.classList.add("flame") // brings flames of hell to the page
    movies.map((movie) => {
        const movieDiv = document.createElement("div")
        movieDiv.classList = "col-lg-3 col-md-4 col-sm-12 m-3 p-0 rounded d-flex flex-column movie-poster"
        movieDiv.innerHTML = `
            <img 
            class="rounded-3 movie-box"  
            src="${BACKDROP_BASE_URL + movie.backdrop_path}" 
            alt="${movie.title} poster">
            <div class="movie-info rounded-3">
                <p>Genre: ${showGenre(movie.genre_ids[0])}</p>
                <p>Rating: ${movie.vote_average}</p>
                <p class="desc">Overview: ${movie.overview.slice(0, 200)}...</p>
            </div>
            <h3 class="movie-title-hell">${movie.title}</h3>`
        movieDiv.addEventListener("click", () => {
            movieDetails(movie)
        })
        CONTAINER.appendChild(movieDiv)
    })
}

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie, cast, simmovies, trailers) => { 
    CONTAINER.classList=""
    // lines 262-268 finds the the director in the crew array 
    let crew = Object.values(cast.crew)
    let director = ""
    for (let i = 0; i < crew.length; i++) {
        if (crew[i].job === "Director") {
            director = crew[i].name
        }
    }
    CONTAINER.innerHTML = `
    <div class="container-fluid d-flex justify-content-between pt-2 bg-secondary p-2 text-dark bg-opacity-75 align-items-center">
        <h1 class="m-4" id="movie-title">${movie.title}</h1>
        <div class="d-flex">
            <p class="m-4">Rating:${movie.vote_average}</p>
            <p class="m-4">Total votes: ${movie.vote_count}</p>
        </div>
    </div>
    <div class="d-flex container-fluid pt-4 bg-secondary p-2 text-dark bg-opacity-50">
        <div class="p-2">
            <img 
            class="rounded-3" 
            id="movie-backdrop" 
            src=${BACKDROP_BASE_URL + movie.backdrop_path}>
        </div>
        <div class="p-2">
            <p id="movie-release-date"><b>Release Date:</b> ${movie.release_date}</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
            <div class="d-flex align-items-center justify-content-center">
                <div class="m-3">
                    <p><b>Language: </b>${movie.original_language}</p>
                    <p><b>Production Company: </b>${movie.production_companies[0].name}</p>
                </div>
                <img 
                class="logo-size img-fluid m-3" 
                src="${BACKDROP_BASE_URL}${movie.production_companies[0].logo_path}">
                <div class="m-3 ">
                    <h3>Director: ${director}</h3>
                </div>
            </div>
        </div>
    </div>
    <div class=" p-5 d-flex justify-content-around bg-secondary text-dark bg-opacity-35">
        <div>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${trailers.results[0].key}"
            title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
            </iframe>
        </div>
        <div>
            <ul id="actors" class="list-unstyled d-flex flex-column align-items-center">
              <h3>Actors</h3>
              <li><button type="button" class="btn btn-outline-warning m-2"id="0"><b>${cast.cast[0].name}</b></button></li>
              <li><button type="button" class="btn btn-outline-warning m-2" id="1"><b>${cast.cast[1].name}</b></button></li>
              <li><button type="button" class="btn btn-outline-warning m-2" id="2"><b>${cast.cast[2].name}</b></button></li>
              <li><button type="button" class="btn btn-outline-warning m-2" id="3"><b>${cast.cast[3].name}</b></button></li>
              <li><button type="button" class="btn btn-outline-warning m-2" id="4"><b>${cast.cast[4].name}</b></button></li>
            </ul>
        </div>
    </div>
        <div class=".bg-secondary bg-opacity-0">
            <h3 style="text-align:center;">Similar Movies</h3>
            <ul id="simmovies" class="list-unstyled d-flex justify-content-around">
                <li class="simmovie m-1" id="5">
                    <img  
                    class="img-size" 
                    src="${BACKDROP_BASE_URL+simmovies.results[0].poster_path}">
                    ${simmovies.results[0].title}
                </li>
                <li class="simmovie m-1" id="6">
                    <img 
                    class="img-size" 
                    src="${BACKDROP_BASE_URL+simmovies.results[1].poster_path}">
                    ${simmovies.results[1].title}
                </li>
                <li class="simmovie m-1" id="7">
                    <img 
                    class="img-size" 
                    src="${BACKDROP_BASE_URL+simmovies.results[2].poster_path}">
                    ${simmovies.results[2].title}
                </li>
                <li class="simmovie m-1" id="8">
                    <img 
                    class="img-size" 
                    src="${BACKDROP_BASE_URL+simmovies.results[3].poster_path}">
                    ${simmovies.results[3].title}
                </li>
                <li class="simmovie m-1" id="9">
                    <img 
                    class="img-size" 
                    src="${BACKDROP_BASE_URL+simmovies.results[4].poster_path}">
                    ${simmovies.results[4].title}
                </li>
            </ul>
        </div>
    </div>
    `
    // Add event listeners to each buttons in the page, and open the actor detail page
    let actorLinks = document.getElementsByTagName("button")
    for (let i = 0; i < actorLinks.length; i++) {
        actorLinks[i].addEventListener("click", () => {
            personDetails(cast.cast[actorLinks[i].id])
        })
    }

    // Add event listener to each similar movie in the page and open the movie details page
    let simLinks = document.getElementsByClassName("simmovie")
    console.log(simLinks)
    for (let i = 0; i < simLinks.length; i++) {
        simLinks[i].addEventListener("click", () => {
            console.log("click")
            movieDetails(simmovies.results[simLinks[i].id-5])
        })
    }
}

// This function places details of actor on the page
const renderActor = (actor, person, personMovies) => {
    CONTAINER.classList.remove("flame")
    CONTAINER.innerHTML = `
    <div class="row bg-secondary bg-opacity-25">
        <div class="col-sm-4 p-4 d-flex align-items-center">
            <img class="rounded-3" src="${PROFILE_BASE_URL + actor.profile_path}">
        </div>
    <div class="col-sm-8 p-4">
        <h3>${actor.name}</h3>
        <h3>Gender: ${showGender(actor.gender)}</h3>
        <h3>Popularity: ${actor.popularity}</h3>
        <h3>Birthday: ${person.birthday}</h3>
        <h3>Deathday: ${person.deathday}</h3>
        <h3 class="pt-5">Biography</h3>
        <p>${person.biography.slice(0,1300)}</p>
    </div>
    </div>
    <div class="p-5 d-flex flex-column align-items-center bg-secondary bg-opacity-25">
        <h3>Actor's Movies: </h3>
        <ul class="d-flex justify-content-between list-unstyled flex-wrap">
            <li class="simmovie p-3" id="0">
            <img src="${PROFILE_BASE_URL+personMovies.cast[0].poster_path}">
            ${personMovies.cast[0].title}
            </li>
            <li class="simmovie p-3" id="1">
            <img src="${PROFILE_BASE_URL+personMovies.cast[1].poster_path}">
            ${personMovies.cast[1].title}
            </li>
            <li class="simmovie p-3" id="2">
            <img src="${PROFILE_BASE_URL+personMovies.cast[2].poster_path}">
            ${personMovies.cast[2].title}
            </li>
            <li class="simmovie p-3" id="3">
            <img src="${PROFILE_BASE_URL+personMovies.cast[3].poster_path}">
            ${personMovies.cast[3].title}
            </li>
            <li class="simmovie p-3" id="4">
            <img src="${PROFILE_BASE_URL+personMovies.cast[4].poster_path}">
            ${personMovies.cast[4].title}
            </li>
        </ul>
    </div>`
    let simLinks = document.getElementsByClassName("simmovie")
    for (let i = 0; i < simLinks.length; i++) {
        simLinks[i].addEventListener("click", () => {
            console.log("click")
            movieDetails(personMovies.cast[simLinks[i].id])
        })
    }
}
// Below we add event listener to each item in the navbar
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
    listActors()
})
POPULAR.addEventListener("click", () => {
    CONTAINER.innerHTML = ""
    listPopular()
})
RELEASE.addEventListener("click", () => {
    CONTAINER.innerHTML = ""
    listRelease()
})
UPCOMING.addEventListener("click", () => {
    CONTAINER.innerHTML = ""
    listUpComing()
})
TOPRATED.addEventListener("click", () => {
    CONTAINER.innerHTML = ""
    listTopRated()
})
NOWPLAYING.addEventListener("click", () => {
    CONTAINER.innerHTML = ""
    listNowPlaying()
})
ABOUT.addEventListener("click", () => {
    CONTAINER.classList = "flame about-hell d-flex justify-content-center p-5"
    CONTAINER.innerHTML = `<p>Welcome to MOVIE HELL.<br>
    We are a team of developers who fell into a deep hell of movies.
    </p>`
})
document.addEventListener("DOMContentLoaded", autorun)
