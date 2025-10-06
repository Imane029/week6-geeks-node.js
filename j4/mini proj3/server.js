const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = 3000;
const BOARD_SIZE = 10;
const OBSTACLE_COUNT = 15;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const games = new Map();

function createInitialBoard() {
    const board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(' '));

    const bases = {
        'P1': { x: 0, y: 0, base: 'B1' },
        'P2': { x: BOARD_SIZE - 1, y: BOARD_SIZE - 1, base: 'B2' }
    };

    board[bases.P1.y][bases.P1.x] = 'P1';
    board[bases.P2.y][bases.P2.x] = 'P2';

    let obstaclesPlaced = 0;
    while (obstaclesPlaced < OBSTACLE_COUNT) {
        const x = Math.floor(Math.random() * BOARD_SIZE);
        const y = Math.floor(Math.random() * BOARD_SIZE);
        
        const isStartOrEnd = (x === bases.P1.x && y === bases.P1.y) || 
                             (x === bases.P2.x && y === bases.P2.y);

        if (board[y][x] === ' ' && !isStartOrEnd) {
            board[y][x] = 'X';
            obstaclesPlaced++;
        }
    }

    return board;
}

function getPlayerPosition(board, playerId) {
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            if (board[y][x] === playerId) {
                return { x, y };
            }
        }
    }
    return null;
}

function checkWinCondition(x, y, playerId) {
    const opponentId = playerId === 'P1' ? 'P2' : 'P1';
    const opponentBaseX = opponentId === 'P2' ? BOARD_SIZE - 1 : 0;
    const opponentBaseY = opponentId === 'P2' ? BOARD_SIZE - 1 : 0;

    if (x === opponentBaseX && y === opponentBaseY) {
        return `${playerId}_WINS`;
    }
    return 'IN_PROGRESS';
}

app.post('/api/game/new', (req, res) => {
    const gameId = uuidv4();
    const player1Token = uuidv4();
    const player2Token = uuidv4();
    const board = createInitialBoard();

    const gameState = {
        gameId,
        player1Token,
        player2Token,
        board,
        turn: 'P1',
        status: 'IN_PROGRESS'
    };

    games.set(gameId, gameState);

    res.json({
        gameId,
        player1Token,
        player2Token,
        initialState: {
            board: gameState.board,
            turn: gameState.turn,
            status: gameState.status
        }
    });
});

app.get('/api/game/:gameId', (req, res) => {
    const gameId = req.params.gameId;
    const gameState = games.get(gameId);

    if (!gameState) {
        return res.status(404).json({ message: 'Jeu non trouvé.' });
    }

    res.json({
        gameId: gameState.gameId,
        board: gameState.board,
        turn: gameState.turn,
        status: gameState.status
    });
});

app.post('/api/game/:gameId/move', (req, res) => {
    const { gameId } = req.params;
    const { token, direction } = req.body;
    const gameState = games.get(gameId);

    if (!gameState) {
        return res.status(404).json({ message: 'Jeu non trouvé.' });
    }
    if (gameState.status !== 'IN_PROGRESS') {
        return res.status(400).json({ message: 'Le jeu est terminé.' });
    }

    const playerId = (token === gameState.player1Token) ? 'P1' : (token === gameState.player2Token) ? 'P2' : null;

    if (!playerId) {
        return res.status(401).json({ message: 'Token de joueur invalide.' });
    }
    if (playerId !== gameState.turn) {
        return res.status(400).json({ message: `Ce n'est pas le tour du joueur ${playerId}.` });
    }

    const currentPos = getPlayerPosition(gameState.board, playerId);
    if (!currentPos) {
         return res.status(500).json({ message: 'Position du joueur introuvable.' });
    }

    let { x, y } = currentPos;
    let newX = x;
    let newY = y;

    switch (direction) {
        case 'UP': newY -= 1; break;
        case 'DOWN': newY += 1; break;
        case 'LEFT': newX -= 1; break;
        case 'RIGHT': newX += 1; break;
        default:
            return res.status(400).json({ message: 'Direction de mouvement invalide.' });
    }

    if (newX < 0 || newX >= BOARD_SIZE || newY < 0 || newY >= BOARD_SIZE) {
        return res.status(400).json({ message: 'Mouvement hors limites.' });
    }

    const targetCell = gameState.board[newY][newX];

    if (targetCell === 'X') {
        return res.status(400).json({ message: 'Mouvement bloqué par un obstacle.' });
    }
    if (targetCell === 'P1' || targetCell === 'P2') {
         return res.status(400).json({ message: 'Mouvement bloqué par un autre joueur.' });
    }

    gameState.board[y][x] = ' '; 
    gameState.board[newY][newX] = playerId;

    gameState.status = checkWinCondition(newX, newY, playerId);
    
    if (gameState.status === 'IN_PROGRESS') {
        gameState.turn = (playerId === 'P1') ? 'P2' : 'P1';
    } else {
        gameState.turn = null;
    }

    games.set(gameId, gameState);

    res.json({
        gameId: gameState.gameId,
        board: gameState.board,
        turn: gameState.turn,
        status: gameState.status
    });
});

app.listen(PORT, () => {
    console.log(`Serveur Express démarré sur http://localhost:${PORT}`);
});
