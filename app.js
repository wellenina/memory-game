document.addEventListener('DOMContentLoaded', () => {

    //card options
    const cardArray = [
        { name: 'cat1',
        path: 'images/andriyko-podilnyk-RCfi7vgJjUY-unsplash.jpg' },
      { name: 'cat2',
        path: 'images/anton-kraev-TuU5tODcrzU-unsplash.jpg' },
      { name: 'cat3',
        path: 'images/bofu-shaw-hL4UUjX8pr0-unsplash.jpg' },
      { name: 'cat4',
        path: 'images/danilo-batista-eSceitc-s30-unsplash.jpg' },
      { name: 'cat5',
        path: 'images/dorothea-oldani-Hhm_fL04bE8-unsplash.jpg' },
      { name: 'cat6',
        path: 'images/dorothea-oldani-j9ONgR_5mOU-unsplash.jpg' },
      { name: 'cat1',
        path: 'images/andriyko-podilnyk-RCfi7vgJjUY-unsplash.jpg' },
      { name: 'cat2',
        path: 'images/anton-kraev-TuU5tODcrzU-unsplash.jpg' },
      { name: 'cat3',
        path: 'images/bofu-shaw-hL4UUjX8pr0-unsplash.jpg' },
      { name: 'cat4',
        path: 'images/danilo-batista-eSceitc-s30-unsplash.jpg' },
      { name: 'cat5',
        path: 'images/dorothea-oldani-Hhm_fL04bE8-unsplash.jpg' },
      { name: 'cat6',
        path: 'images/dorothea-oldani-j9ONgR_5mOU-unsplash.jpg' }
    ]
  
    // randomizza le carte
    cardArray.sort(() => 0.5 - Math.random())
  
    const grid = document.querySelector('.grid') // picks the element grid from HTML and defines it as grid for our JS
    const resultDisplay = document.querySelector('#result')
    let cardsChosen = [] // conterrà i nomi delle 2 carte cliccate una dopo l'altra
    let cardsChosenId = [] // idem, ma con gli ID (num da 0 a 11)
    let cardsWon = [] // conterrà i nomi delle carte già matchate
  
    //create your board
    function createBoard() {
      for (let i = 0; i < cardArray.length; i++) { // per ogni carta (oggetto dentro all'array)
        const flipBox = document.createElement('div')
        flipBox.setAttribute('class', 'flip-box');
        flipBox.addEventListener( 'click', function() {
         flipBox.classList.toggle('is-flipped');
        });
        grid.appendChild(flipBox);
        
        const flipBoxInner = document.createElement('div')
        flipBoxInner.setAttribute('class', 'flip-box-inner');
        flipBox.appendChild(flipBoxInner);
        
        const flipBoxFront = document.createElement('div')
        flipBoxFront.setAttribute('class', 'flip-box-front');
        flipBoxInner.appendChild(flipBoxFront);
        
        const imgFront = document.createElement('img');
        imgFront.setAttribute('src', cardArray[i].path);
        imgFront.setAttribute('data-id', i);
        flipBoxFront.appendChild(imgFront);
        
        const flipBoxBack = document.createElement('div')
        flipBoxBack.setAttribute('class', 'flip-box-back');
        flipBoxInner.appendChild(flipBoxBack);
        
        const imgBack = document.createElement('img');
        imgBack.setAttribute('src', 'images/back.png');
        imgBack.addEventListener('click', flipCard);
        flipBoxBack.appendChild(imgBack);
      }
    }

    //flip your card
    function flipCard() { // funziona invocata quando la carta viene cliccata
        let cardId = this.getAttribute('data-id') // this si riverisce alla card/<img> cliccata, cardId prende l'attributo 'data-id', cioè un numero da 0 a 11
        cardsChosen.push(cardArray[cardId].name) // prende l'id e lo usa come index dell'array delle carte, tira fuori il nome della carta e lo aggiunge a cardsChosen
        cardsChosenId.push(cardId)  // aggiunge a cardsChosenId l'id della carta
        this.setAttribute('src', cardArray[cardId].path) // aggiorna l'attributo 'src' dell'elemento <img> con il path all'immagine della carta
        if (cardsChosen.length ===2) {  // dopo ogni click, verifica se sono state cliccate 2 carte. Se sì
          setTimeout(checkForMatch, 500) // aspetta 500 millisecondi, poi invoca checkForMatch
        }
      }
  
    //check for matches
    function checkForMatch() { // questa funzione viene invocata alla fine di flipCard(), cioè quando 2 carte sono state cliccate, cioè quando in entrambi cardsChosen e cardsChosenId ci sono 2 elementi
        const cards = document.querySelectorAll('img') // crea cards, una lista di nodi di tutte le immagini della pagina
        const optionOneId = cardsChosenId[0] // flipCard() ha aggiunto l'id della prima carta scelta a cardsChosen
        const optionTwoId = cardsChosenId[1]
        
        if(optionOneId == optionTwoId) { // se l'utente ha cliccato la stessa immagine, cioè con lo stesso id
          cards[optionOneId].setAttribute('src', 'images/blank.png') // ri-gira la carta, cioè setta l'attributo 'src'
          cards[optionTwoId].setAttribute('src', 'images/blank.png')
          alert('You have clicked the same image!')
        }
        else if (cardsChosen[0] === cardsChosen[1]) { // se gli id sono diversi, ma il nome è lo stesso: è un match
          alert('You found a match')
          cards[optionOneId].setAttribute('src', 'images/white.png') // la carta va via, cioè setta l'attributo 'src' a immagine bianca
          cards[optionTwoId].setAttribute('src', 'images/white.png')
          cards[optionOneId].removeEventListener('click', flipCard) // rimuove, da quella immagine ora bianca, il listener per il click
          cards[optionTwoId].removeEventListener('click', flipCard) // cioè le due carte non sono più cliccabili
          cardsWon.push(cardsChosen) // cardsChosen è l'array con i nomi delle due carte cliccate, uguali. cardsWon è un array di questi array
        } else { // se le due carte non sono uguali
          cards[optionOneId].setAttribute('src', 'images/blank.png') // gira le carte
          cards[optionTwoId].setAttribute('src', 'images/blank.png')
          alert('Sorry, try again')
        }
        cardsChosen = []  // dopo che che 2 carte sono state cliccate, sia che matchino o no, i due array vengono puliti
        cardsChosenId = []
        resultDisplay.textContent = cardsWon.length // resultDisplay è l'elemento <span> nel titolo. Gli cambia il testo contenuto con in numero di match fatti
        if  (cardsWon.length === cardArray.length/2) {  // se hai matchato tutte le carte
          resultDisplay.textContent = 'Congratulations! You found them all!'
        }
      }
  
    createBoard()
  })