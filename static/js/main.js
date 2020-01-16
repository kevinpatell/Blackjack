document.addEventListener('DOMContentLoaded', function () {
  
  const hit = document.querySelector('#hit-btn');
  const stand = document.querySelector('#stand-btn');
  const deal = document.querySelector('#deal-btn');
  const hitSound = new Audio('static/sounds/swish.m4a');
  const winSound = new Audio('static/sounds/cash.mp3');
  const lostSound = new Audio('static/sounds/aww.mp3');

  let blackjackGame = {
    'player': {'scoreSpan': '#player-blackjack-score','div':'#player-cards' ,'score': 0},
    'dealer': {
      'scoreSpan': '#dealer-blackjack-score',
      'div': '#dealer-cards',
      'score': 0
    },
    'cards': ['2C', '2D', '2H', '2S', '3C', '3D', '3H', '3S', '4C', '4D', '4H', '4S', '5C', '5D', '5H', '5S', '6C', '6D', '6H', '6S', '7C', '7D', '7H', '7S', '8C', '8D', '8H', '8S', '9C', '9D', '9H', '9S', '10C', '10D', '10H', '10S', 'JC', 'JD', 'JH', 'JS', 'QC', 'QD', 'QH', 'QS', 'KC', 'KD', 'KH', 'KS', 'AC', 'AD', 'AH', 'AS'],
    'cardsMap': {
      '2C': 2, '2D': 2, '2H': 2, '2S': 2, '3C': 3, '3D': 3, '3H': 3, '3S': 3, '4C': 4, '4D': 4, '4H': 4, '4S': 4, '5C': 5, '5D': 5, '5H': 5, '5S': 5, '6C': 6, '6D': 6, '6H': 6, '6S': 6, '7C': 7, '7D': 7, '7H': 7, '7S': 7, '8C': 8, '8D': 8, '8H': 8, '8S': 8, '9C': 9, '9D': 9, '9H': 9, '9S': 9, '10C': 10, '10D': 10, '10H': 10, '10S': 10, 'JC': 10, 'JD': 10, 'JH': 10, 'JS': 10, 'QC': 10, 'QD': 10, 'QH': 10, 'QS': 10, 'KC': 10, 'KD': 10, 'KH': 10, 'KS': 10, 'AC': [1, 11], 'AD': [1, 11], 'AH': [1, 11], 'AS': [1, 11]
    },
    'wins': 0,
    'losses': 0,
    'pushed': 0,
    'cardDealt': false,
    'isStand': false,
    'turnsOver': false,
    'playerStatus': false,
  };
  
  const player = blackjackGame.player;
  const dealer = blackjackGame.dealer;

  
  let playersHit = () => {
    if (blackjackGame.cardDealt === true && blackjackGame.isStand === false) {
      let card = randomCard();
      showCard(card, player);
      updateScore(card, player);
      showScore(player);
    }
  };
  
  let randomCard = () => {
    let randomIndex = Math.floor(Math.random() * 52);
    return blackjackGame.cards[randomIndex];
  };
  
  let sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

 

  let blackjackDeal = async () => {

    if (blackjackGame.cardDealt === false) {
      for (i = 0; i < 2; i++) {
        let card = randomCard();
        showCard(card, player);
        updateScore(card, player);
        showScore(player);
        await sleep(500);
      }
      dealersHit();
      backCard();
    }

    blackjackGame.cardDealt = true;
    if (blackjackGame.turnsOver === true) {
      blackjackGame.isStand = false;
      let playerImages = document.querySelector('#player-cards').querySelectorAll('img');
      let dealerImages = document.querySelector('#dealer-cards').querySelectorAll('img');
      for (let i=0; i < playerImages.length; i++) {
        playerImages[i].remove();
      }
      for (let i=0; i < dealerImages.length; i++) {
        dealerImages[i].remove();
      }

      player.score = 0;
      dealer.score = 0;

      // let playerScoreTag = document.createElement('span');
      // let dealerScoreTag = document.createElement('span');

      // playerScoreTag.className = "dot";
      // playerScoreTag.id = "player-blackjack-score";
      // playerScoreTag.textContent = "0";
      // playerScoreTag.style.color = "#ffffff";

      // dealerScoreTag.className = "dot";
      // dealerScoreTag.id = "dealer-blackjack-score";
      // dealerScoreTag.textContent = "0";
      // dealerScoreTag.style.color = "#ffffff";



      document.querySelector('#player-blackjack-score').textContent ='0';
      document.querySelector('#dealer-blackjack-score').textContent ='0';
      document.querySelector(player.scoreSpan).style.color = '#ffffff';
      document.querySelector(dealer.scoreSpan).style.color = '#ffffff';

      document.querySelector('#blackjack-result').textContent = "Let's Play!";
      document.querySelector('#blackjack-result').style.color = "#ffffff";

      blackjackGame.turnsOver = false;
      blackjackGame.cardDealt = false;
    }
  };

  let dealersHit = () => {
    let card = randomCard();
    showCard(card, dealer);
    updateScore(card, dealer);
    showScore(dealer);
  };


  let dealerLogic = async () => {
    console.log(blackjackGame.isStand);
    if (blackjackGame.cardDealt === true) {
      let backCard = document.querySelector(dealer.div); 
      backCard.removeChild(backCard.childNodes[1]);


      blackjackGame.isStand = true;

      while (dealer.score < 17 && blackjackGame.isStand === true) {
        dealersHit();
        await sleep(1000);
      }

      blackjackGame.turnsOver = true;
      let winner = computeWinner();
      showResult(winner);
    }
  };

  hit.addEventListener('click', playersHit);
  stand.addEventListener('click', dealerLogic);
  deal.addEventListener('click', blackjackDeal);
  
  let showCard = (card, activePlayer) => {

    if (activePlayer.score <= 21) {
      let cardImage = document.createElement('img');
      cardImage.style.width = "100px";
      cardImage.src = `static/images/Cards/${card}.png`;
      document.querySelector(activePlayer.div).appendChild(cardImage);
      hitSound.play();
    }
  };

  let backCard = () => {
      let cardImage = document.createElement('img');
      cardImage.style.width = "108px";
      cardImage.src = 'static/images/Cards/back-card.jpg';
      document.querySelector(dealer.div).appendChild(cardImage);
      hitSound.play();
  };



  let updateScore = (card, activePlayer) => {

      if (card === 'AC' || card === 'AD' || card === 'AH' || card === 'AS') {
        if (activePlayer.score + blackjackGame.cardsMap[card][1] <= 21) {
          activePlayer.score += blackjackGame.cardsMap[card][1];
        } else {
          activePlayer.score += blackjackGame.cardsMap[card][0];
        }
      } else {
        activePlayer.score += blackjackGame.cardsMap[card];
      }
  };

  let showScore = (activePlayer) => {
    if (activePlayer > 21) {
      document.querySelector(activePlayer.scoreSpan).textContent = 'BUSTED';
      document.querySelector(activePlayer.scoreSpan).style.color = 'red';
    } else {
      document.querySelector(activePlayer.scoreSpan).textContent = activePlayer.score;
    }
  };
  
  let computeWinner = () => {
    let winner;
    
    if (player.score <= 21 ) {
      if (player.score > dealer.score || dealer.score > 21) {
        blackjackGame.wins++;
        winner = player;
      } else if (player.score < dealer.score) {
        blackjackGame.losses++;
        winner = dealer;
      } else if (player.score === dealer.score) {
        blackjackGame.pushed++;
      } 
    } else if (player.score > 21 && dealer.score <= 21) {
      blackjackGame.losses++;
      winner = dealer;
      dealerLogic();
    } else if (player.score > 21 && dealer.score > 21) {
      blackjackGame.pushed++;
    }
    return winner;
  };
 
  let showResult = (winner) => {
    let message, messageColor;

    if (blackjackGame.turnsOver === true) {

      if (winner === player) {
        document.querySelector('#wins').textContent = blackjackGame.wins;
        message = "You Won!";
        messageColor = "green";
        winSound.play();
        
      } else if (winner === dealer) {
        document.querySelector('#losses').textContent = blackjackGame.losses;
        message = "You Lost!";
        messageColor = "red";
        lostSound.play();
        
      } else {
        document.querySelector('#push').textContent = blackjackGame.pushed;
        message = "Pushed";
        messageColor = "black";
      }
      
      document.querySelector('#blackjack-result').textContent = message;
      document.querySelector('#blackjack-result').style.color = messageColor;
    }

  };

  
  

});