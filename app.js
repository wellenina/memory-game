document.addEventListener('DOMContentLoaded', () => {
  
  const board = document.querySelector('.board');
  let cardArray = [];
  const message = document.querySelector('#message');
  const matches = document.querySelector('#matches');
  const movesDisplay = document.querySelector('#moves');
  let moves = 0;
  const gameWon = document.querySelector('.game-won');
  let cardsChosen = [];
  let cardsChosenId = [];
  let cardsWon = [];
  let valueTheme = 'kitten'; // default theme
  let valueDifficulty = 6; // default difficulty level (easy)
  const startNewGameBtn = document.getElementById('new-game-btn');
  startNewGameBtn.addEventListener('click', startAnotherGame);
  let gameOver = false;
  
  // start new game
  function newGame() {
    cardArray = selectCards(valueTheme, valueDifficulty);
    const imgBackPath = findImgBack(valueTheme);
    createBoard(cardArray, imgBackPath);
  }

  // return paths to selected cards, based on theme and difficulty
  function selectCards(theme, difficulty) {
    let allCards = [];
    for (let i = 1; i <= 25; i++) {
      allCards.push('images/' + theme + i + '.jpg'); // path to all the 25 card options
    }
    allCards.sort(() => 0.5 - Math.random()); // shuffle cards
    allCards.splice(difficulty); // keep the first 6, 12 or 20 cards
    allCards = allCards.concat(allCards); // double cards
    return allCards.sort(() => 0.5 - Math.random()); // re-shuffle cards
  }

  function findImgBack(theme) { // return path to image of the back of the cards
    return 'images/' + theme + '-back.jpg';
  }
  
  //create the board
  function createBoard(cardArray, imgBackPath) {

    for (let i = 0; i < cardArray.length; i++) {
      const flipBox = document.createElement('div');
      flipBox.setAttribute('class', `flip-box cards${valueDifficulty}`);
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
  }

  // flip a card - invoked when clicking on a card
  function flipCard() {
    if (paused === undefined) { // start stopwatch when the first card is clicked
      stopwatch = setInterval(incrementTime, 1000);
      pauseResumeBtn.style.visibility = 'visible';
      paused = false;
    }
    this.classList.toggle('is-flipped'); // flipping card animation
    new Audio('sound/flipcard-91468.mp3').play();
    this.removeEventListener('click', flipCard);
    let cardId = this.getAttribute('data-id');
    cardsChosen.push(cardArray[cardId]);
    cardsChosenId.push(cardId);
    if (cardsChosen.length === 2) {  // check if a pair of cards has been flipped
      disableClick(true);
      setTimeout(checkForMatch, 1050) // invoke checkForMatch() function
    }
  }
  
  // check for matches - invoked by flipCard() when 2 cards have been flipped
  function checkForMatch() {
    movesDisplay.textContent = ++moves;
    const cards = document.querySelectorAll('div.flip-box');
    const optionOneId = cardsChosenId[0];
    const optionTwoId = cardsChosenId[1];
      
    if (cardsChosen[0] === cardsChosen[1]) { // it's a match!
      cardsWon.push(cardsChosen);
      matches.textContent = cardsWon.length;
      message.textContent = 'You found a match! 🥳 YAY!';
      if  (cardsWon.length === cardArray.length/2) {  // it's a match AND all the cards have been matched - GAME WON
        new Audio('sound/success-fanfare-trumpets-6185.mp3').play();
        clearInterval(stopwatch); // stop the time
        pauseResumeBtn.style.visibility = 'hidden';
        gameOver = true;
        board.classList.add('disappear');
        setTimeout(function() {
          board.style.display = 'none';
          gameWon.style.display = 'block';
          gameWon.scrollIntoView();
        }, 800);
      } else { // it's a match BUT the game is not over
        new Audio('sound/decidemp3-14575.mp3').play();
        cards[optionOneId].classList.add('disappear');
        cards[optionTwoId].classList.add('disappear');
        // cards[optionOneId].style.visibility = "hidden";
        // cards[optionTwoId].style.visibility = "hidden";
      }} else { // it's not a match
        new Audio('sound/wronganswer-37702.mp3').play();
        cards[optionOneId].addEventListener('click', flipCard);
        cards[optionTwoId].addEventListener('click', flipCard);
        message.textContent = 'OH NO! 😭 Try again';
        cards[optionOneId].classList.toggle('is-flipped'); // flipping card animation
        cards[optionTwoId].classList.toggle('is-flipped');
    }
    cardsChosen = [];
    cardsChosenId = [];
    setTimeout(function() {disableClick(false)}, 500);
  }

  function disableClick(bool) {
    document.body.classList.toggle('disabled');
    document.documentElement.style.cursor = bool ? "wait" : "auto";
  };
  
  // invoked when clicking on "Start new game" button
  function startAnotherGame() {
    board.style.visibility = 'hidden';
    board.replaceChildren();
  
    // reset message and counters
    message.textContent = 'Let\’s play!';
    matches.textContent = 0;
    cardsWon = [];
    movesDisplay.textContent = 0;
    moves = 0;
    cardsChosen = [];
    cardsChosenId = [];
    resetStopwatch();
  
    if (gameOver) {
      gameWon.style.display = 'none';
      reaction.style.display = 'none';
      gifReaction.removeAttribute('src');
      board.classList.remove('disappear');
      board.style.display = 'flex';
      gameOver = false;
    }
  
    // get inputs from player
    const selectTheme = document.getElementById('theme');
    valueTheme = selectTheme.value;
    const selectDifficulty = document.getElementById('difficulty');
    valueDifficulty = selectDifficulty.value; // value: 6, 12, 20
  
    newGame();
    document.getElementById('header').scrollIntoView(); // NON FUNZIONA (?) /////////////////////////////
  
    setTimeout(function() {
      board.style.visibility = 'visible' // display the board after short delay
    }, 100);
  }

  newGame();

  // display a silly reaction gif after a game won
  const reaction = document.querySelector('.reaction');
  const gifReaction = document.getElementById('gif-reaction');
  const playAgainBtn = document.getElementById('play-again-btn'); // button "Yeah definitely can't wait!"
  playAgainBtn.addEventListener('click', function() {
    displayReaction(happy);
  });
  const nevermoreBtn = document.getElementById('nevermore-btn'); // button "No, thanks, I'm good"
  nevermoreBtn.addEventListener('click', function() {
    displayReaction(sad);
  });
  const happy = [['dZ4Mjq65R6Vl4ByVMy', 'Ww6XqrwrLR4ZrIZLCa', 'xUPJPB7DuFNoa8mqqY', 'XurKBe1Urqn4hsxYBR', 'xTiN0ELHTRx5iKUKru', 'l0Exbi7eBQ7v0iREI', 'nYItBY4R8gaXK', 'n9ONPpvaJzlQMAsE9o', 'iurIHLBxms7UQ', 'dStGLzAv2QT4c', 'Uq44mYg7mGUQMYllVf', 'MsWfQDM0xvDNfT4MRN', 'eAAGcrAYceFgSrPk1X', '134MhjLjg4mhc4', '3oiITfc0J8nvSxOSKf'], 'YAY!<br>Please select a theme and a difficulty level:'];
  const sad = [['Qvm2704d1Dqus', 'DfTZWmFpLx3os', 'cPKWZB2aaB3rO', 'IW6GHuaFldi1O', 'DFNd1yVyRjmF2', '9hBW9Ay4pW10Y', 'XDKsF8ZR59DFvZVxwL', 'l22ysLe54hZP0wubek', 'YLgIOmtIMUACY', 'nZipTf7i0sP8A', 'ls08tlIPCsnVS', 'Jq7y34Hgfy01y', 'eo2IEkCJ7ceNJy7cq6', '3HHxwYjiCMTvTNEib7', 'aV0TP55kop0s1NoKI2', 'JWoZAgK794t51DrxAA', 'l0HlIHz7I8Vlgvvws', 'c615QQXQ3kDn33Kwnx'], 'Oh, OK...<br>Well...<br>If you change your mind...'];

  function displayReaction(mood) {
    gifReaction.setAttribute('src', `https://giphy.com/embed/${mood[0][Math.floor(Math.random()*mood[0].length)]}`);
    document.getElementById('reaction-comment').innerHTML = mood[1];

    gameWon.style.display = 'none';
    reaction.style.display = 'block';
    reaction.scrollIntoView();
  }


  // stopwatch

  // minutes and seconds
  const minutesDisplay = document.getElementById("minutes");
  const secondsDisplay = document.getElementById("seconds");
  let minutes = 0;
  let seconds = 0;

  function incrementTime() {
    if (seconds === 59) {
      minutes < 9 ? minutesDisplay.textContent = '0' + ++minutes : minutesDisplay.textContent = ++minutes;
      seconds = 0;
      secondsDisplay.textContent = '00';
    } else {
      seconds < 9 ? secondsDisplay.textContent = '0' + ++seconds : secondsDisplay.textContent = ++seconds;
  }};

  const pauseResumeBtn = document.getElementById('pause-resume-btn');
  pauseResumeBtn.addEventListener('click', pauseResumeStopwatch);

  let stopwatch;
  let paused;
  const pausedGameOverlay = document.getElementById('paused');

  function pauseResumeStopwatch() {
    if (paused) { // resume
      stopwatch = setInterval(incrementTime, 1000);
      paused = false;
      pauseResumeBtn.setAttribute('src', 'images/pause.png');
      pauseResumeBtn.setAttribute('alt', 'Pause game button');
      pausedGameOverlay.style.display = 'none';
    } else { // pause
      clearInterval(stopwatch);
      paused = true;
      pauseResumeBtn.setAttribute('src', 'images/play.png');
      pauseResumeBtn.setAttribute('alt', 'Resume game button');
      pausedGameOverlay.style.display = 'block';
  }};

  function resetStopwatch() {
    if (paused === undefined) {
      return;
    }

    if (!gameOver) {
      pauseResumeBtn.style.visibility = 'hidden';
      if (paused) {
        pauseResumeBtn.setAttribute('src', 'images/pause.png');
        pauseResumeBtn.setAttribute('alt', 'Pause game button');
        pausedGameOverlay.style.display = 'none';
      } else {
        clearInterval(stopwatch);
      }
    }

    // reset time to 00:00
    minutes = 0;
    seconds = 0;
    minutesDisplay.textContent = '00';
    secondsDisplay.textContent = '00';
    paused = undefined;
  };

  })