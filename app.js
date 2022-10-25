document.addEventListener('DOMContentLoaded', () => {
  
    const grid = document.querySelector('.grid')
    const message = document.querySelector('#message')
    const matches = document.querySelector('#matches')
    const flipped = document.querySelector('#flipped')
    const gameWon = document.querySelector('.game-won')
    const reaction = document.querySelector('.reaction')
    let cardsFlipped = 0;
    let cardsChosen = []
    let cardsChosenId = []
    let cardsWon = []
  
    //create the board
    function createBoard() {
      for (let i = 0; i < cardArray.length; i++) {

        const flipBox = document.createElement('div')
        flipBox.setAttribute('class', 'flip-box');
        flipBox.setAttribute('data-id', i); // data-id attribute = item index in cardArray
        flipBox.addEventListener('click', flipCard)
        grid.appendChild(flipBox);
        
        const flipBoxInner = document.createElement('div')
        flipBoxInner.setAttribute('class', 'flip-box-inner');
        flipBox.appendChild(flipBoxInner);
        
        const flipBoxFront = document.createElement('div')
        flipBoxFront.setAttribute('class', 'flip-box-front');
        flipBoxInner.appendChild(flipBoxFront);
        
        const imgFront = document.createElement('img');
        imgFront.setAttribute('src', cardArray[i]);
        flipBoxFront.appendChild(imgFront);
        
        const flipBoxBack = document.createElement('div')
        flipBoxBack.setAttribute('class', 'flip-box-back');
        flipBoxInner.appendChild(flipBoxBack);
        
        const imgBack = document.createElement('img');
        imgBack.setAttribute('src', imgBackPath);
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
        cardsChosen.push(cardArray[cardId])
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
        cardsWon.push(cardsChosen)
        matches.textContent = cardsWon.length
        message.textContent = 'You found a match! 🥳 YAY!'

      if  (cardsWon.length === cardArray.length/2) {  // all the cards have been matched
        new Audio("sound/success-fanfare-trumpets-6185.mp3").play();
        grid.style.display = 'none'
        gameWon.style.display = 'block'
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


  function startNewGame() { // CHIAMATA QUANDO SI CLICCA IL BOTTONE

    let selectTheme = document.getElementById('theme');
    let valueTheme = selectTheme.value; // get selected theme
    let selectDifficulty = document.getElementById('difficulty');
    let valueDifficulty = selectDifficulty.value; // selected difficulty (value: 6, 10, 18)

    const cardArray = selectCards(valueTheme, valueDifficulty); // the cards
    const imgBackPath = findImgBack(valueTheme)
    // creare la board di conseguenza

    // SE CHIAMATA QUANDO FINITO UN GIOCO:
    message.textContent = 'Let&rsquo;s play!'; // reset message and counters
    matches.textContent = 0;
    cardsWon = [];
    flipped.textContent = 0;
    cardsFlipped = 0;
    grid.style.display = 'flex'; // display the board
    gameWon.style.display = 'none'; // hide other sections
    reaction.style.display = 'none';
  }



  function selectCards(theme, difficulty) { // RITORNA ARRAY CON PATH ALLE CARTE SELZIONATE IN BASE A TEMA E DIFFICOLTà
    let allCards = []; // path to all the 25 card options
    for (let i = 1; i <= 25; i++) {
      allCards.push("images/" + theme + i + ".jpg");
    }
    allCards.sort(() => 0.5 - Math.random()); // shuffling cards
    allCards.splice(difficulty); // keeping the first 6, 10 or 18 cards
    allCards = allCards.concat(allCards); // doubling cards
    return allCards.sort(() => 0.5 - Math.random()); // re-shuffling cards
    }

  function findImgBack(theme) { // RITORNA PATH PER IL RETRO DELLA CARTA
    return "images/" + theme + "-back.jpg";
  }

  })