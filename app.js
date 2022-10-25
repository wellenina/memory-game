document.addEventListener('DOMContentLoaded', () => {
  
  const board = document.querySelector('.board');
  let cardArray = [];
  const message = document.querySelector('#message');
  const matches = document.querySelector('#matches');
  const flipped = document.querySelector('#flipped');
  let cardsFlipped = 0; // counter for flipped cards
  const gameWon = document.querySelector('.game-won');
  const reaction = document.querySelector('.reaction');
  let cardsChosen = [];
  let cardsChosenId = [];
  let cardsWon = [];
  let valueTheme = 'kitten'; // default theme
  let valueDifficulty = 6; // default difficulty level (easy)
  let playerTurn = false;

  const startNewGameBtn = document.getElementById('new-game-btn');
  startNewGameBtn.addEventListener('click', startAnotherGame);
  const nevermoreBtn = document.getElementById('nevermore-btn');
  nevermoreBtn.addEventListener('click', nevermore);

  function newGame() {
    cardArray = selectCards(valueTheme, valueDifficulty); // select the cards (default values)
    const imgBackPath = findImgBack(valueTheme);
    createBoard(cardArray, imgBackPath); // create the board
    playerTurn = true;
  }

  function selectCards(theme, difficulty) { // return paths to selected cards, based on theme and difficulty
    let allCards = []; // path to all the 25 card options
    for (let i = 1; i <= 25; i++) {
      allCards.push('images/' + theme + i + '.jpg');
    }
    allCards.sort(() => 0.5 - Math.random()); // shuffle cards
    allCards.splice(difficulty); // keep the first 6, 10 or 18 cards
    allCards = allCards.concat(allCards); // double cards
    return allCards.sort(() => 0.5 - Math.random()); // re-shuffle cards
  }

  function findImgBack(theme) { // return path to image of the back of the cards
    return 'images/' + theme + '-back.jpg';
  }
  
  function createBoard(cardArray, imgBackPath) { //create the board
    for (let i = 0; i < cardArray.length; i++) {
      const flipBox = document.createElement('div');
      flipBox.setAttribute('class', 'flip-box');
      flipBox.setAttribute('data-id', i); // data-id attribute = item index in cardArray
      flipBox.addEventListener('click', flipCard);
      board.appendChild(flipBox);
        
      const flipBoxInner = document.createElement('div');
      flipBoxInner.setAttribute('class', 'flip-box-inner');
      flipBox.appendChild(flipBoxInner);
        
      const flipBoxFront = document.createElement('div');
      flipBoxFront.setAttribute('class', 'flip-box-front');
      flipBoxInner.appendChild(flipBoxFront);
        
      const imgFront = document.createElement('img');
      imgFront.setAttribute('src', cardArray[i]);
      flipBoxFront.appendChild(imgFront);
        
      const flipBoxBack = document.createElement('div');
      flipBoxBack.setAttribute('class', 'flip-box-back');
      flipBoxInner.appendChild(flipBoxBack);
        
      const imgBack = document.createElement('img');
      imgBack.setAttribute('src', imgBackPath);
      flipBoxBack.appendChild(imgBack);
    }
    /////////
  }

  function flipCard() { //flip a card
    if (playerTurn === false) {
      return;
    }
    this.classList.toggle('is-flipped'); // flipping card animation
    new Audio('sound/flipcard-91468.mp3').play();
    this.removeEventListener('click', flipCard);
    flipped.textContent = ++cardsFlipped;
    let cardId = this.getAttribute('data-id');
    cardsChosen.push(cardArray[cardId]);
    cardsChosenId.push(cardId);
    if (cardsChosen.length ===2) {  // check if a pair of cards has been flipped
      playerTurn = false;
      document.body.style.cursor = "wait";
      setTimeout(checkForMatch, 800) // invoke checkForMatch() function
    }
  }
  
  function checkForMatch() { //check for matches
    const cards = document.querySelectorAll('div.flip-box');
    const optionOneId = cardsChosenId[0];
    const optionTwoId = cardsChosenId[1];
      
    if (cardsChosen[0] === cardsChosen[1]) { // it's a match!
      cardsWon.push(cardsChosen);
      matches.textContent = cardsWon.length;
      message.textContent = 'You found a match! 🥳 YAY!';
      if  (cardsWon.length === cardArray.length/2) {  // it's a match AND all the cards have been matched - GAME WON
        new Audio('sound/success-fanfare-trumpets-6185.mp3').play();
        board.style.display = 'none';
        gameWon.style.display = 'block';
      } else { // it's a match BUT the game is not over
        new Audio('sound/decidemp3-14575.mp3').play();
        cards[optionOneId].style.visibility = "hidden";
        cards[optionTwoId].style.visibility = "hidden";
      }} else { // it's not a match
      new Audio('sound/wronganswer-37702.mp3').play();
      cards[optionOneId].addEventListener('click', flipCard);
      cards[optionTwoId].addEventListener('click', flipCard);
      setTimeout((cards[optionOneId].classList.toggle('is-flipped')), 700); // flipping card animation
      setTimeout((cards[optionTwoId].classList.toggle('is-flipped')), 700); // flipping card animation
      message.textContent = 'OH NO! 😭 Try again';
    }
    cardsChosen = [];
    cardsChosenId = [];
    playerTurn = true;
    document.body.style.cursor = "auto";
    }
  
  function startAnotherGame() { // invoked when clicking on "Start new game" button
    playerTurn = false;
    board.replaceChildren();
    message.textContent = 'Let\’s play!'; // reset message and counters
    matches.textContent = 0;
    cardsWon = [];
    flipped.textContent = 0;
    cardsFlipped = 0;
    gameWon.style.display = 'none'; // hide sections
    reaction.style.display = 'none';

    const selectTheme = document.getElementById('theme'); // get inputs from player
    valueTheme = selectTheme.value;
    const selectDifficulty = document.getElementById('difficulty');
    valueDifficulty = selectDifficulty.value; // value: 6, 10, 18

    newGame();
    board.style.display = 'flex'; // display the board
  }

  function nevermore() { // invoked by click on button --DA FINIRE--
    gameWon.style.display = 'none';
    reaction.style.display = 'block';

    // AGGIUNGERE IMMAGINE RANDOM
  }

  newGame();
  })