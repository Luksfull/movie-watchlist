import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: 'https://movie-watchlist-zla-default-rtdb.europe-west1.firebasedatabase.app/'
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const movieWatchlistInDB = ref(database, 'movieWatchlist')

const searchBtn = document.getElementById('submit-btn')
let searchName = document.getElementById('search-bar')
let filmList = document.getElementById('film-list')

// https://movie-watchlist-zla-default-rtdb.europe-west1.firebasedatabase.app/

searchBtn.addEventListener('click', searchFilms)

function searchFilms(e) {
    e.preventDefault()
    const apiKey = '1d5bc7d3'
    
    if(searchName.value){
        
        document.getElementById('intro').style.display = 'none'
        
        fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchName.value}`)
            .then(res => res.json())
            .then(data => {        
                data.Search.forEach(movie => {   
                        fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`)
                            .then(res => res.json())
                            .then(data => {
                                filmList.innerHTML += `
                                    <div class='result'>
                                        <img src='${movie.Poster}' width=100px height=150px>
                                        <div class='movie-details'>
                                        
                                            <div class='title-rating'>
                                                <span class='movie-title'>${movie.Title}</span>
                                                <i class="fa-solid fa-star fa-xs" id="imdb-star" style="color: #fec654;"></i>
                                                <span class='imdb-rating'>${data.imdbRating}</span>
                                            </div>
                                            
                                            <div class='runtime-genre'>
                                                <span>${data.Runtime}</span>
                                                <span>${data.Genre}</span>
                                                <button class='add-btn' data-add='${movie.imdbID}'><i class="fa-solid fa-circle-plus fa-xs" style="color: #ffffff;"></i>Watchlist</button>
                                            </div>
                                            
                                            <div class='plot'>
                                                ${data.Plot}
                                            </div>
                                            
                                        </div>
                                    </div>
                                    `
                            })
                            
                            filmList.innerHTML = ""
                            
                })
        })
    }
}

filmList.addEventListener('click', e => {
    if(e.target.dataset.add) {
        const movieID = e.target.dataset.add
        // addToWatchlist(movieID)
        addToWatchlist(movieID)
    }
})

function addToWatchlist(movieID) {
    push(movieWatchlistInDB, movieID)
}





