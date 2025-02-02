document.addEventListener('DOMContentLoaded', () => {
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    const startGameButton = document.getElementById('start-game');
    const gameBoard = document.getElementById('game-board');
    const scoreBoard = document.getElementById('score-board');
    const turnIndicator = document.getElementById('turn-indicator');
    const resultDisplay = document.getElementById('result');
    const resetGameButton = document.getElementById('reset-game');
    const player1ScoreDisplay = document.getElementById('player1-score');
    const player2ScoreDisplay = document.getElementById('player2-score');

    let player1Name = '';
    let player2Name = '';
    let currentPlayer = 'X';
    let boardState = ['', '', '', '', '', '', '', '', ''];
    let scores = { player1: 0, player2: 0 };
    let gameActive = true;

    startGameButton.addEventListener('click', () => {
        player1Name = player1Input.value || 'Player 1';
        player2Name = player2Input.value || 'Player 2';
        document.getElementById('player-names').classList.add('hidden');
        gameBoard.classList.remove('hidden');
        scoreBoard.classList.remove('hidden');
        turnIndicator.classList.remove('hidden');
        resetGameButton.classList.remove('hidden');
        updateTurnIndicator();
    });

    gameBoard.addEventListener('click', (e) => {
        if (!gameActive) return;

        const cell = e.target;
        const index = cell.getAttribute('data-index');

        if (boardState[index] === '') {
            boardState[index] = currentPlayer;
            cell.textContent = currentPlayer;
            cell.classList.add(currentPlayer === 'X' ? 'x' : 'o');
            if (checkWin()) {
                endGame(false);
            } else if (boardState.every(cell => cell !== '')) {
                endGame(true);
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                updateTurnIndicator();
            }
        }
    });

    resetGameButton.addEventListener('click', resetGame);

    function updateTurnIndicator() {
        turnIndicator.textContent = `${currentPlayer === 'X' ? player1Name : player2Name}'s turn`;
    }

    function checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        return winPatterns.some(pattern => {
            return pattern.every(index => boardState[index] === currentPlayer);
        });
    }

    function endGame(isDraw) {
        gameActive = false;
        if (isDraw) {
            resultDisplay.textContent = 'It\'s a draw!';
            turnIndicator.classList.add('hidden');
        } else {
            resultDisplay.textContent = `${currentPlayer === 'X' ? player1Name : player2Name} wins!`;
            scores[currentPlayer === 'X' ? 'player1' : 'player2']++;
            updateScores();
            turnIndicator.classList.add('hidden');
            highlightWinningCombination();
        }
        resultDisplay.classList.remove('hidden');
    }

    function highlightWinningCombination() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        const winningPattern = winPatterns.find(pattern => {
            return pattern.every(index => boardState[index] === currentPlayer);
        });

        if (winningPattern) {
            const [a, b, c] = winningPattern;
            const cellA = document.querySelector(`.cell[data-index="${a}"]`);
            const cellB = document.querySelector(`.cell[data-index="${b}"]`);
            const cellC = document.querySelector(`.cell[data-index="${c}"]`);

            cellA.classList.add('win');
            cellB.classList.add('win');
            cellC.classList.add('win');

            const rectA = cellA.getBoundingClientRect();
            const rectC = cellC.getBoundingClientRect();
            const gameBoardRect = gameBoard.getBoundingClientRect();

            const line = document.createElement('div');
            line.classList.add('winning-line');
            gameBoard.appendChild(line);

            const angle = Math.atan2(rectC.top - rectA.top, rectC.left - rectA.left);
            const length = Math.sqrt(
                Math.pow(rectC.left - rectA.left, 2) + Math.pow(rectC.top - rectA.top, 2)
            );

            line.style.width = `${length}px`;
            line.style.transform = `rotate(${angle}rad)`;
            line.style.left = `${rectA.left - gameBoardRect.left + rectA.width / 2}px`;
            line.style.top = `${rectA.top - gameBoardRect.top + rectA.height / 2}px`;

            setTimeout(() => {
                line.style.opacity = '1';
                line.style.transform = `rotate(${angle}rad) scaleX(1)`;
            }, 10);
        }
    }

    function updateScores() {
        player1ScoreDisplay.textContent = `${player1Name}: ${scores.player1}`;
        player2ScoreDisplay.textContent = `${player2Name}: ${scores.player2}`;
    }

    function resetGame() {
        boardState = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        resultDisplay.classList.add('hidden');
        turnIndicator.classList.remove('hidden');
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'win');
        });

        const winningLine = document.querySelector('.winning-line');
        if (winningLine) {
            winningLine.remove();
        }

        updateTurnIndicator();
    }
});