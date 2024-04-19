let sentiment;
let statusEl;
let submitBtn;
let inputBox;
let sentimentResult;

function setup() {
  noCanvas();
  // initialize sentiment
  sentiment = ml5.sentiment('movieReviews', modelReady);

  // setup the html environment
  statusEl = createP('Loading Model...');
  inputBox = createInput('Today is the happiest day and is full of rainbows!');
  inputBox.attribute('size', '75');
  submitBtn = createButton('submit');
  sentimentResult = createP('sentiment score:');

  // predicting the sentiment on mousePressed()
  submitBtn.mousePressed(getSentiment);
}

function getSentiment() {
  // get the values from the input
  const text = inputBox.value();

  // make the prediction
  const prediction = sentiment.predict(text);

  // display sentiment result on html page
  sentimentResult.html(`Sentiment score: ${prediction.score}`);
}

function modelReady() {
  // model is ready
  statusEl.html('model loaded');
}

const apiKey = 'a0ff309c498c8ae5835c2d733be3a51e';

// Obtener películas populares
fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`)
  .then(response => response.json())
  .then(data => {
    // Seleccionar 10 películas aleatorias
    const randomMovies = getRandomMovies(data.results, 10);

    // Obtener reseñas de las películas seleccionadas
    randomMovies.forEach(movie => {
      fetch(`https://api.themoviedb.org/3/movie/${movie.id}/reviews?api_key=${apiKey}&language=en-US&page=1`)
        .then(response => response.json())
        .then(data => {
          // Procesar las reseñas de la película
          const reviews = data.results.map(review => review.content.substring(0, 190));
          console.log(`Reseñas de la película "${movie.title}":`, reviews);
        })
        .catch(error => {
          console.error(`Error al obtener reseñas de la película "${movie.title}":`, error);
        });
    });
  })
  .catch(error => {
    console.error('Error al obtener películas populares:', error);
  });

// Función para seleccionar películas aleatorias
function getRandomMovies(movies, count) {
  const randomMovies = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * movies.length);
    randomMovies.push(movies[randomIndex]);
  }
  return randomMovies;
}
