document.addEventListener('DOMContentLoaded', () => {
    const symbols = ["🍎", "🍌", "🍇", "🍉", "🍒", "🍑", "🍍", "🍓"];
    const gameBoard = document.querySelector('.game-board');
    let flippedCards = [];
    let cardElements = [];
    let moves = 0;
    let matches = 0;
    const totalPairs = symbols.length;
    const moveCountElement = document.getElementById('move-count');
    const feedbackElement = document.getElementById('feedback');
    const timerElement = document.getElementById('timer');

    let gameStarted = false; // Track if the game has started
    let startTime, timerInterval;

    const cardSymbols = shuffle([...symbols, ...symbols]);

    cardSymbols.forEach(symbol => {
        const card = createCard(symbol);
        gameBoard.appendChild(card);
        cardElements.push(card);
    });

    cardElements.forEach(card => {
        card.addEventListener('click', () => {
            if (flippedCards.length < 2 && !card.classList.contains('show-symbol')) {
                flipCard(card);
            }
        });
    });

    function createCard(symbol) {
        const card = document.createElement('div');
        card.classList.add('card', 'hide-symbol');
        card.textContent = symbol;
        return card;
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function flipCard(card) {
        if (!gameStarted) {
            startTimer(); // Start the timer when the first move is made
            gameStarted = true;
        }

        card.classList.remove('hide-symbol');
        card.classList.add('show-symbol');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            incrementMoveCount();
            checkForMatch();
        }
    }

    function incrementMoveCount() {
        moves += 1;
        moveCountElement.textContent = moves;
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;

        if (card1.textContent === card2.textContent) {
            matches += 1;
            flippedCards = [];
            if (matches === totalPairs) {
                stopTimer(); // Stop the timer when all pairs are matched
                feedbackElement.textContent = getPerformanceFeedback();
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('show-symbol');
                card1.classList.add('hide-symbol');
                card2.classList.remove('show-symbol');
                card2.classList.add('hide-symbol');
                flippedCards = [];
            }, 1000);
        }
    }

    function getPerformanceFeedback() {
        if (moves <= 16) {
            return "Excellent! You matched all pairs in " + moves + " moves!";
        } else if (moves <= 24) {
            return "Good job! You matched all pairs in " + moves + " moves.";
        } else {
            return "Keep practicing! You matched all pairs in " + moves + " moves.";
        }
    }

    // Start the timer when the game starts
    function startTimer() {
        startTime = new Date().getTime();

        timerInterval = setInterval(() => {
            const currentTime = new Date().getTime();
            const elapsedTime = currentTime - startTime;

            const minutes = Math.floor(elapsedTime / 60000);
            const seconds = Math.floor((elapsedTime % 60000) / 1000);

            timerElement.textContent = formatTime(minutes, seconds);
        }, 1000);
    }

    // Stop the timer
    function stopTimer() {
        clearInterval(timerInterval);
    }

    // Format the time to display as mm:ss
    function formatTime(minutes, seconds) {
        const minutesString = minutes < 10 ? '0' + minutes : minutes;
        const secondsString = seconds < 10 ? '0' + seconds : seconds;
        return `${minutesString}:${secondsString}`;
    }
});
