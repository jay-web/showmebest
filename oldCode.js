console.log('Hi there!');

// Fetch data
const fetchData = async (searchTerm) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '3efb450',
            s: searchTerm
        }
    });

    // console.log(response.data);
    if (response.data.Error) {
        return [];
    }
    return response.data.Search;
}
const root = document.querySelector(".autocomplete");


root.innerHTML = `
    <label><b> Search movie here ... </b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results">

            </div>
        </div>
    </div>
`;

const input = document.querySelector(".input");
const dropdown = document.querySelector(".dropdown");
const resultWrapper = document.querySelector(".results");

const searchAsPerInput = async (event) => {
    const movies = await fetchData(event.target.value);
    resultWrapper.innerHTML = "";
    // Iterate over return movies and render the same on html if result is available
    if (!movies.length) {
        dropdown.classList.remove("is-active");
        return;
    }
    if (movies.length > 0) {
        dropdown.classList.add("is-active");

        for (let movie of movies) {
            //   console.log(movie);
            const moviesList = document.createElement("a");           // ? Create the anchor element

            moviesList.classList.add("dropdown-item");            // ? add class dropdown-item in anchor element
            moviesList.innerHTML = `
          <img src="${movie.Poster}" />
           ${movie.Title} 
        `;
            resultWrapper.appendChild(moviesList);

            moviesList.addEventListener("click", () => {
                dropdown.classList.remove("is-active");
                input.value = movie.Title;
                onMovieSelect(movie);
            });
        }
    }

}

input.addEventListener("input", debounce(searchAsPerInput, 500));

// close the dropdown if we click outside the dropdown
document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) {
        dropdown.classList.remove("is-active");
    }
});

const onMovieSelect = async (movie) => {
    console.log(movie.imdbID);
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '3efb450',
            i: movie.imdbID
        }
    });

    console.log(response.data);
    document.querySelector("#summary").innerHTML = movieTemplate(response.data);
}


// Individual movie details html template

const movieTemplate = (movieDetail) => {
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
            <p class="title"> ${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article class="notification is-primary">
            <p class="title"> ${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article class="notification is-primary">
            <p class="title"> ${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article class="notification is-primary">
            <p class="title"> ${movieDetail.imdbRating}</p>
            <p class="subtitle">IMBD Rating</p>
        </article>
        <article class="notification is-primary">
            <p class="title"> ${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMBD Votes</p>
        </article>
    `
}