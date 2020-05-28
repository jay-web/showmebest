console.log('Hi there!');


const autoCompleteConfig = {
    renderOption: (movie) => {
        const imgSrc = movie.Poster == "N/A" ? "" : movie.Poster;
      return  `
          <img src="${imgSrc}" />
           ${movie.Title} (${movie.Year})
        `
    },
   
    changeInputValue: (movie) => {
        // console.log(movie)
        return movie.Title;
    },
    fetchData: async (searchTerm) => {
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
}


// using autocomplete widget

autoComplete({
    ...autoCompleteConfig,          // it will copy the entire above object and will paste in autoComplete and will add root then
    root: document.querySelector("#left-autocomplete"),
    onOptionSelect: (movie) => {
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie, document.querySelector("#left-summary"), "left");
    }
   
});

autoComplete({
    ...autoCompleteConfig,          // it will copy the entire above object and will paste in autoComplete and will add root then
    root: document.querySelector("#right-autocomplete"),
    onOptionSelect: (movie) => {
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie, document.querySelector("#right-summary"), "right");
    },
   
});

let leftSide;
let rightSide;


const onMovieSelect = async (movie, summaryElement, side) => {
    // console.log(movie.imdbID);
    
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '3efb450',
            i: movie.imdbID
        }
    });

    // console.log(response.data);
    summaryElement.innerHTML = movieTemplate(response.data);

    if(side === "left"){
        leftSide = response.data;
    }else{
        rightSide = response.data;
    }

    if(leftSide && rightSide){
        startCompare();
    }
    
}

// Both side comparsion function

   const startCompare = () => {
        let leftSideStats = document.querySelectorAll("#left-summary .notification");
        let rightSideStats = document.querySelectorAll("#right-summary .notification");

        leftSideStats.forEach((leftStat, index) => {
            let rightStat = rightSideStats[index];

            let leftSideValue = leftStat.dataset.value;
            let rightSideValue = rightStat.dataset.value;


            if(rightSideValue > leftSideValue){
                leftStat.classList.remove("is-primary");
                leftStat.classList.add("is-warning");
                
            }else{
                rightStat.classList.add("is-warning");
                rightStat.classList.remove("is-primary");
            }
        });
    }






// Individual movie details html template

const movieTemplate = (movieDetail) => {
    console.log(movieDetail);
    let BoxOffice = 0;
    if(movieDetail.BoxOffice != "N/A"){
        BoxOffice = parseInt(movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, ""));
    }

    let Metascore = parseInt(movieDetail.Metascore);
    let imbdRating = parseFloat(movieDetail.imdbRating);
    let imdbVotes = parseInt((movieDetail.imdbVotes).replace(/,/g, ""));
    let count = 0;

    let awards = movieDetail.Awards.split(" ").forEach(word => {
        let value = parseInt(word);
        if(isNaN(value)){
            return;
        }else{
            count = count + value;
        }
    });

    console.log(Metascore, imbdRating, imdbVotes, count);

    

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
                <p><b>Director</b> : ${movieDetail.Director}</p>
                <p><b>Rated</b> : ${movieDetail.Rated}</p>
                </div>
            </div>
        </article>
        <div class="margin-top"></div>
        <article data-value=${count} class="notification is-primary">
            <p class="title"> ${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${BoxOffice} class="notification is-primary">
            <p class="title"> ${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${Metascore} class="notification is-primary">
            <p class="title"> ${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imbdRating} class="notification is-primary">
            <p class="title"> ${movieDetail.imdbRating}</p>
            <p class="subtitle">IMBD Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title"> ${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMBD Votes</p>
        </article>
    `
}