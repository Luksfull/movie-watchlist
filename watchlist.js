import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: 'https://movie-watchlist-zla-default-rtdb.europe-west1.firebasedatabase.app/'
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const movieWatchlistInDB = ref(database, 'movieWatchlist')

const watchlist = document.getElementById('watchlist')
const emptyPage = document.getElementById('empty-page')

onValue(movieWatchlistInDB, function(snapshot) {
    
    emptyPage.style.display = 'none'
    let moviesArray = Object.entries(snapshot.val())
    let moviesIDArray = Object.values(snapshot.val())
    moviesIDArray.forEach(movieID => {
        
      const apiKey = '1d5bc7d3'
        
      fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movieID}`)
        .then(res => res.json())
        .then(data => {

          watchlist.innerHTML += 
						`
            <div class='result'>
                <img src='${data.Poster}' width=100px height=150px>
                <div class='movie-details'>
                
                    <div class='title-rating'>
                        <span class='movie-title'>${data.Title}</span>
                        <i class="fa-solid fa-star fa-xs" id="imdb-star" style="color: #fec654;"></i>
                        <span class='imdb-rating'>${data.imdbRating}</span>
                    </div>
                    
                    <div class='runtime-genre'>
                        <span>${data.Runtime}</span>
                        <span>${data.Genre}</span>
                        <button class='remove-btn' id='${movieID}' data-remove='${movieID}'><i class="fa-solid fa-circle-minus fa-xs" style="color: #ffffff;"></i>Remove</button>
                    </div>
                    
                    <div class='plot'>
                        ${data.Plot}
                    </div>
                    
                </div>
            </div>                    
            `
        })      
    })
    
    watchlist.addEventListener('click', e => {
        
      moviesArray.forEach(entry => {
				console.log(entry)
          let databaseID = entry[0]
          let movieDatabaseID = entry[1]
					
          if(e.target.dataset.remove === movieDatabaseID) {
            let exactLocationOfMovieInDB = ref(database, `movieWatchlist/${databaseID}`)
            remove(exactLocationOfMovieInDB)
            document.getElementById(movieDatabaseID).parentElement.parentElement.parentElement.remove()
						// console.log(moviesArray)
      		}	
      })
    })       
})
                     

