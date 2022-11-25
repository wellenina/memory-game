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
  let theme = 'kitten'; // default theme
  let difficulty = 6; // default difficulty level (easy)
  const startNewGameBtn = document.getElementById('new-game-btn');
  startNewGameBtn.addEventListener('click', startAnotherGame);
  let isGameOver = false;
  

  function newGame() {
    cardArray = createCardDeck(theme, difficulty);
    const imgBackPath = getImgBackPath(theme);
    createBoard(cardArray, imgBackPath);
  }


  function createCardDeck(theme, difficulty) {
    let allCards = [];
    for (let i = 1; i <= 25; i++) {
      allCards.push(`images/${theme+i}.jpg`); // path to all the 25 card options
    }
    allCards.sort(() => 0.5 - Math.random()).splice(difficulty);
    return allCards.concat(allCards).sort(() => 0.5 - Math.random());
  }

  function getImgBackPath(theme) {
    return `images/${theme}-back.jpg`;
  }
  

  function createBoard(cardArray, imgBackPath) {

    for (let i = 0; i < cardArray.length; i++) {
      const flipBox = document.createElement('div');
      flipBox.setAttribute('class', `flip-box cards${difficulty}`);
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


  function flipCard() { // invoked when clicking on a card
    if (isPaused === undefined) { // start stopwatch when the first card is clicked
      stopwatch = setInterval(incrementTime, 1000);
      pauseResumeBtn.style.visibility = 'visible';
      isPaused = false;
    }
    this.classList.toggle('is-flipped'); // flipping card animation
    this.removeEventListener('click', flipCard);
    playSound(flipping);
    const cardId = this.getAttribute('data-id');
    cardsChosen.push(cardArray[cardId]);
    cardsChosenId.push(cardId);
    if (cardsChosen.length === 2) {  // check if a pair of cards has been flipped
      disableClick(true);
      setTimeout(checkForMatch, 1000);
    }
  }
  

  function checkForMatch() {  // invoked by flipCard() when 2 cards have been flipped
    movesDisplay.textContent = ++moves;
    const cards = document.querySelectorAll('div.flip-box');
    const optionOneId = cardsChosenId[0];
    const optionTwoId = cardsChosenId[1];
      
    if (cardsChosen[0] === cardsChosen[1]) { // it's a match!
      cardsWon.push(cardsChosen);
      matches.textContent = cardsWon.length;
      message.textContent = 'You found a match! 🥳 YAY!';
      if  (cardsWon.length === cardArray.length/2) {  // it's a match AND all the cards have been matched
        playSound(success);
        clearInterval(stopwatch);
        pauseResumeBtn.style.visibility = 'hidden';
        isGameOver = true;
        board.classList.add('disappear');
        setTimeout(function() {
          board.style.display = 'none';
          gameWon.style.display = 'block';
          gameWon.scrollIntoView();
        }, 800);
      } else { // it's a match BUT the game is not over
        playSound(rightAnswer);
        cards[optionOneId].classList.add('disappear');
        cards[optionTwoId].classList.add('disappear');
      }} else { // it's not a match
        playSound(wrongAnswer);
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
  }
  

  function startAnotherGame() {  // invoked when clicking on "Start new game" button
    board.style.visibility = 'hidden';

    try {
      board.replaceChildren(); // replaceChildren() is not supported by browsers older than 2020
    } catch {
      while (board.firstChild) {
        board.removeChild(board.firstChild);
      }
    }
  
    // reset message and counters
    message.textContent = 'Let\’s play!';
    matches.textContent = 0;
    cardsWon = [];
    movesDisplay.textContent = 0;
    moves = 0;
    cardsChosen = [];
    cardsChosenId = [];
    resetStopwatch();
  
    if (isGameOver) {
      gameWon.style.display = 'none';
      reaction.style.display = 'none';
      gifReaction.removeAttribute('src');
      board.classList.remove('disappear');
      board.style.display = 'flex';
      isGameOver = false;
    }
  
    // get inputs from player
    theme = document.getElementById('theme').value;
    difficulty = document.getElementById('difficulty').value; // 6, 12, 20
  
    newGame();
    document.getElementById('header').scrollIntoView();
  
    setTimeout(function() {
      board.style.visibility = 'visible';
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

  const minutesDisplay = document.getElementById("minutes");
  const secondsDisplay = document.getElementById("seconds");
  let minutes = 0;
  let seconds = 0;

  function incrementTime() {
    if (seconds === 59) {
      minutes < 9 ? minutesDisplay.textContent = `0${++minutes}` : minutesDisplay.textContent = ++minutes;
      seconds = 0;
      secondsDisplay.textContent = '00';
    } else {
      seconds < 9 ? secondsDisplay.textContent = `0${++seconds}` : secondsDisplay.textContent = ++seconds;
    }
  }

  const pauseResumeBtn = document.getElementById('pause-resume-btn');
  pauseResumeBtn.addEventListener('click', pauseResumeStopwatch);

  let stopwatch;
  let isPaused;
  const pausedGameOverlay = document.getElementById('paused');

  function pauseResumeStopwatch() {
    if (isPaused) { // resume
      stopwatch = setInterval(incrementTime, 1000);
      isPaused = false;
      pauseResumeBtn.setAttribute('src', 'images/pause.png');
      pauseResumeBtn.setAttribute('alt', 'Pause game button');
      pausedGameOverlay.style.display = 'none';
    } else { // pause
      clearInterval(stopwatch);
      isPaused = true;
      pauseResumeBtn.setAttribute('src', 'images/play.png');
      pauseResumeBtn.setAttribute('alt', 'Resume game button');
      pausedGameOverlay.style.display = 'block';
    }
  }

  document.addEventListener("keydown", event => {
    if (event.code === 'Escape' || event.code === 'Space') {
      event.preventDefault();
      pauseResumeStopwatch();
    }
  });

  function resetStopwatch() {
    if (isPaused === undefined) {
      return;
    }

    if (!isGameOver) {
      pauseResumeBtn.style.visibility = 'hidden';
      if (isPaused) {
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
    isPaused = undefined;
  }

  // sound off/sound on button
  let isMuted = false;
  const soundOnOffBtn = document.getElementById('sound-on-off-btn');
  soundOnOffBtn.addEventListener('click', soundOnOff);

  function soundOnOff() {
    if (isMuted) {
      soundOnOffBtn.setAttribute('src', 'images/mute.png');
      soundOnOffBtn.setAttribute('alt', 'Mute button');
      isMuted = false;
    } else {
      soundOnOffBtn.setAttribute('src', 'images/soundon.png');
      soundOnOffBtn.setAttribute('alt', 'Sound on button');
      isMuted = true;
    }
  }

  // sound effects
  const flipping = new Audio('sound/flipcard-91468.mp3');
  const rightAnswer = new Audio('sound/decidemp3-14575.mp3');
  const wrongAnswer = new Audio('sound/wronganswer-37702.mp3');
  const success = new Audio('sound/success-fanfare-trumpets-6185.mp3');

  function playSound(sound) {
    if (!isMuted) {
      sound.play();
    }
  }

  })