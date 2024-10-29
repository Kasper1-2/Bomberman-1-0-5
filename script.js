const grid = document.getElementById('grid');
const playerPositions = [];
let playerCount = 0;

const layout = [
    ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    ['O', 'P', 'F', 'D', 'D', 'X', 'D', 'D', 'D', 'D', 'D', 'D', 'O'],
    ['O', 'F', 'X', 'D', 'X', 'D', 'X', 'D', 'D', 'X', 'D', 'F', 'O'],
    ['O', 'D', 'D', 'D', 'X', 'D', 'D', 'X', 'D', 'D', 'D', 'D', 'O'],
    ['O', 'X', 'D', 'D', 'X', 'D', 'D', 'X', 'D', 'X', 'D', 'F', 'O'],
    ['O', 'D', 'D', 'D', 'D', 'X', 'D', 'D', 'D', 'D', 'D', 'F', 'O'],
    ['O', 'D', 'X', 'F', 'D', 'D', 'C', 'F', 'D', 'D', 'X', 'F', 'O'],
    ['O', 'F', 'D', 'D', 'X', 'D', 'D', 'D', 'D', 'X', 'D', 'D', 'O'],
    ['O', 'X', 'F', 'D', 'D', 'X', 'D', 'D', 'D', 'D', 'X', 'D', 'O'],
    ['O', 'D', 'D', 'D', 'X', 'D', 'D', 'D', 'X', 'D', 'D', 'F', 'O'],
    ['O', 'D', 'X', 'D', 'D', 'F', 'X', 'D', 'F', 'D', 'X', 'F', 'O'],
    ['O', 'F', 'F', 'F', 'X', 'D', 'D', 'D', 'X', 'D', 'F', 'P', 'O'],
    ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O']
];


layout.forEach((row, rowIndex) => {
    row.forEach((cellType, collIndex) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');

        
        switch (cellType) {
            case 'C': cell.classList.add('center');
                break;
            case 'O': cell.classList.add('outer-wall');
                break;
            case 'X': cell.classList.add('inner-wall');
                break;
            case 'D': cell.classList.add('destructible');
                break;
            case 'F': cell.classList.add('floor');
                break;
            case 'P': 
                const player = document.createElement('div');
                playerCount++;
                player.classList.add('player', `player${playerCount}`);
                cell.appendChild(player);

                playerPositions.push({ id: `player${playerCount}`, x: collIndex, y: rowIndex})
                break;
        }

        grid.appendChild(cell);
    });
});

function updateGrid(x, y) {
    const cellIndex = y * layout[0].length + x;
    const cell = grid.children[cellIndex];

    cell.innerHTML = '';

    switch (layout [y][x]) {
        case 'O': cell.classList.add('outer-wall');
            break;
        case 'X': cell.classList.add('inner-wall');
            break;
        case 'D': cell.classList.add('destructible');
             break;
        case 'F': cell.classList.add('floor');
            break;
        case 'P': 
                const player = document.createElement('div');
                playerElement.classList.add('player');
                cell.appendChild(playerElement);
                break;
    }
}

function isDestructibleWall(x, y) {
    return layout [y][x] === 'D'
}

const playerData = [
    {id: 'player1', x: 0, y: 0, hasActiveBomb: false},
    {id: 'player2', x: 0, y: 0, hasActiveBomb: false}
];

function createBomb(playerIndex, x, y) {
    const player = playerData[playerIndex];

    if (player.hasActiveBomb) {
        console.log(`Player ${playerIndex + 1}: You can only place one bomb at a time!`);
        return;
    }

    player.hasActiveBomb = true;
    const bomb = document.createElement('div');
    bomb.classList.add('bomb');
    const cell = grid.children[y * layout[0].length + x];
    cell.appendChild(bomb);

    layout[y][x] = 'B'
    playerBombs.push({ playerIndex, x, y, bomb });

    console.log(`Player ${playerIndex + 1} placed a bomb at (${x}, ${y})`);

    setTimeout(() => explodeBomb(playerIndex, bomb, x, y), Math.random() * (3000 - 1500) + 1500); 
}


const playerBombs = [];
const maxBombs = 1;

function explodeBomb(playerIndex, bomb, x, y) {
    console.log(`Player ${playerIndex + 1}'s bomb at (${x}, ${y}) exploded!`);
    removeBomb(bomb); 
    
    const directions = [
        { x: 0, y: -1 }, // Up
        { x: 0, y: 1 },  // Down
        { x: -1, y: 0 }, // Left
        { x: 1, y: 0 }   // Right
    ];

    directions.forEach(direction => {
        const targetX = x + direction.x; // Calculate target x
        const targetY = y + direction.y; // Calculate target y

        if (targetY >= 0 && targetY < layout.length && targetX >= 0 && targetX < layout[0].length) {
            if (isDestructibleWall(targetX, targetY)) {
                layout[targetY][targetX] = 'F'; 
                updateGrid(targetX, targetY); 
            }
        }
    });

    playerData[playerIndex].hasActiveBomb = false;
    console.log(`Player ${playerIndex + 1} can now place another bomb.`);
}




function removeBomb(bomb) {
    if (bomb && bomb.parentNode) {
        bomb.parentNode.removeChild(bomb);
    }
}



function movePlayer(playerIndex, newX, newY) {
    const playerData = playerPositions[playerIndex];

    if(newY >= 0 && newY < layout.length && newX >= 0 && newX < layout[0].length){
        if (layout[newY][newX] === 'F' || layout [newY][newX] === 'C') {
            const playerElement = grid.querySelector(`.${playerData.id}`);

            layout[playerData.y][playerData.x] = 'F';

            const oldCell = grid.children[playerData.y * layout[0].length + playerData.x];
            oldCell.removeChild(playerElement);
            

            playerData.x = newX;
            playerData.y = newY;

            const newCell = grid.children[newY * layout[0].length + newX];
            newCell.appendChild(playerElement);

            layout[newY][newX] = 'P'
        } else if(layout[newY][newX] !=='B') {
            return;
    }   
    }
}

document.addEventListener('keydown', (event) => {
    const player1 = playerPositions[0];
    const player2 = playerPositions[1]; 
    
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
    }


    switch (event.key) {
        case 'w': movePlayer(0, player1.x, player1.y - 1);
            break;
        case 's': movePlayer(0, player1.x, player1.y + 1);
            break;
        case 'a': movePlayer(0, player1.x - 1, player1.y);
            break;
        case 'd': movePlayer(0, player1.x + 1, player1.y);
            break;
        case 'ArrowUp': movePlayer(1, player2.x, player2.y - 1);
            break;
        case 'ArrowDown': movePlayer(1, player2.x, player2.y + 1);
            break;
        case 'ArrowLeft': movePlayer(1, player2.x - 1, player2.y);
            break;
        case 'ArrowRight': movePlayer(1, player2.x + 1, player2.y);
            break;
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'z') {
        createBomb(0, playerPositions[0].x, playerPositions[0].y); // For Player 1 
    }
    if (event.key === '-'){
        createBomb(1, playerPositions[1].x, playerPositions[1].y) // For Player
    }
});

