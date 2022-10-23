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
    const gameWon = document.querySelector('.gameWon')
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
    function flipCard() {
        this.classList.toggle('is-flipped'); // flipping card animation
        new Audio("sound/flipcard-91468.mp3").play();
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
        // setTimeout((cards[optionOneId].style.visibility = 'hidden'), 700);
        // setTimeout((cards[optionTwoId].style.visibility = 'hidden'), 700);
        cardsWon.push(cardsChosen)
        matches.textContent = cardsWon.length
        message.textContent = 'You found a match! 🥳 YAY!'

      if  (cardsWon.length === cardArray.length/2) {  // all the cards have been matched
        new Audio("sound/success-fanfare-trumpets-6185.mp3").play();
        grid.style.display = 'none'
        gameWon.style.display = 'block'
        // setTimeout((alert('Congratulations! You found them all!')), 1000);
        // message.textContent = 'Wanna play again?'
      } else {
        new Audio("sound/decidemp3-14575.mp3").play();
        setTimeout((cards[optionOneId].style.visibility = 'hidden'), 700);
        setTimeout((cards[optionTwoId].style.visibility = 'hidden'), 700);
      }} else { // it's not a match
        new Audio("sound/wronganswer-37702.mp3").play();
        cards[optionOneId].addEventListener('click', flipCard);
        cards[optionTwoId].addEventListener('click', flipCard);
        setTimeout((cards[optionOneId].classList.toggle('is-flipped')), 700); // flipping card animation
        setTimeout((cards[optionTwoId].classList.toggle('is-flipped')), 700); // flipping card animation
        message.textContent = 'OH NO! 😭 Try again'
      }
      cardsChosen = []  // dopo che che 2 carte sono state cliccate, sia che matchino o no, i due array vengono puliti
      cardsChosenId = []       
    }
  
  
    createBoard()
  })