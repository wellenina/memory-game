document.addEventListener('DOMContentLoaded', () => {

    // the cards
    const cardArray = [ // attenzione! l'array contiene già le coppie di carte (nome e path uguale)
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
  
    // shuffling cards
    cardArray.sort(() => 0.5 - Math.random())
  
    const grid = document.querySelector('.grid')
    const message = document.querySelector('#message')
    const matches = document.querySelector('#matches')
    const flipped = document.querySelector('#flipped')
    let cardsFlipped = 0;
    let cardsChosen = []
    let cardsChosenId = []
    let cardsWon = []
  
    //create the board
    function createBoard() {
      for (let i = 0; i < cardArray.length; i++) {

        const flipBox = document.createElement('div')
        flipBox.setAttribute('class', 'flip-box');
        flipBox.setAttribute('data-id', i);
        flipBox.addEventListener('click', flipCard)
        grid.appendChild(flipBox);
        
        const flipBoxInner = document.createElement('div')
        flipBoxInner.setAttribute('class', 'flip-box-inner');
        flipBox.appendChild(flipBoxInner);
        
        const flipBoxFront = document.createElement('div')
        flipBoxFront.setAttribute('class', 'flip-box-front');
        flipBoxInner.appendChild(flipBoxFront);
        
        const imgFront = document.createElement('img');
        imgFront.setAttribute('src', cardArray[i].path);
        flipBoxFront.appendChild(imgFront);
        
        const flipBoxBack = document.createElement('div')
        flipBoxBack.setAttribute('class', 'flip-box-back');
        flipBoxInner.appendChild(flipBoxBack);
        
        const imgBack = document.createElement('img');
        imgBack.setAttribute('src', 'images/back.png');
        flipBoxBack.appendChild(imgBack);
      }
    }

    //flip a card
    function flipCard() { // funziona invocata quando la carta viene cliccata
        this.classList.toggle('is-flipped'); // flipping card animation
        this.removeEventListener('click', flipCard);
        flipped.textContent = ++cardsFlipped;
        let cardId = this.getAttribute('data-id')
        cardsChosen.push(cardArray[cardId].name)
        cardsChosenId.push(cardId)
        if (cardsChosen.length ===2) {  // dopo ogni click, verifica se sono state cliccate 2 carte. Se sì
          setTimeout(checkForMatch, 800) // aspetta 500 millisecondi, poi invoca checkForMatch
        }
      }
  
    //check for matches
    function checkForMatch() {
        const cards = document.querySelectorAll('div.flip-box')
        const optionOneId = cardsChosenId[0]
        const optionTwoId = cardsChosenId[1]
        
        if (cardsChosen[0] === cardsChosen[1]) { // it's a match
          message.textContent = 'You found a match! 🥳 YAY!'
          setTimeout((cards[optionOneId].style.visibility = 'hidden'), 700);
          setTimeout((cards[optionTwoId].style.visibility = 'hidden'), 700);
          cardsWon.push(cardsChosen)
        } else { // it's not a match
          cards[optionOneId].addEventListener('click', flipCard);
          cards[optionTwoId].addEventListener('click', flipCard);
          setTimeout((cards[optionOneId].classList.toggle('is-flipped')), 700);
          setTimeout((cards[optionTwoId].classList.toggle('is-flipped')), 700);
          message.textContent = 'OH NO! 😭 Try again'
        }
        cardsChosen = []  // dopo che che 2 carte sono state cliccate, sia che matchino o no, i due array vengono puliti
        cardsChosenId = []
        matches.textContent = cardsWon.length
        if  (cardsWon.length === cardArray.length/2) {  // all the cards have been matched
          alert('Congratulations! You found them all!')
          message.textContent = 'Wanna play again?'
        }
      }
  
    createBoard()
  })