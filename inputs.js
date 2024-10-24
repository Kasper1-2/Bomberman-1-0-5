// Get the grid container
const grid = document.getElementById('grid');

// Define the 13x13 grid layout based on the plan
const layout = [
    ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    ['O', 'P', 'F', 'F', 'X', 'F', 'D', 'F', 'X', 'F', 'F', 'P', 'O'],
    ['O', 'F', 'X', 'F', 'D', 'F', 'X', 'F', 'D', 'F', 'X', 'F', 'O'],
    ['O', 'F', 'D', 'F', 'X', 'F', 'D', 'F', 'X', 'F', 'D', 'F', 'O'],
    ['O', 'X', 'F', 'D', 'F', 'X', 'F', 'D', 'F', 'X', 'F', 'D', 'O'],
    ['O', 'F', 'D', 'F', 'X', 'F', 'D', 'F', 'X', 'F', 'D', 'F', 'O'],
    ['O', 'D', 'X', 'F', 'D', 'F', 'X', 'F', 'D', 'F', 'X', 'F', 'O'],
    ['O', 'F', 'D', 'F', 'X', 'F', 'D', 'F', 'X', 'F', 'D', 'F', 'O'],
    ['O', 'X', 'F', 'D', 'F', 'X', 'F', 'D', 'F', 'X', 'F', 'D', 'O'],
    ['O', 'F', 'D', 'F', 'X', 'F', 'D', 'F', 'X', 'F', 'D', 'F', 'O'],
    ['O', 'F', 'X', 'F', 'D', 'F', 'X', 'F', 'D', 'F', 'X', 'F', 'O'],
    ['O', 'P', 'F', 'F', 'X', 'F', 'D', 'F', 'X', 'F', 'F', 'P', 'O'],
    ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O']
];

// Loop through the layout and create divs for each cell
layout.forEach(row => {
    row.forEach(cellType => {
        const cell = document.createElement('div');
        cell.classList.add('cell');

        // Assign a class based on the cell type
        switch (cellType) {
            case 'O': // Outer Wall
                cell.classList.add('outer-wall');
                break;
            case 'X': // Inner Wall
                cell.classList.add('inner-wall');
                break;
            case 'D': // Destructible Wall
                cell.classList.add('destructible');
                break;
            case 'F': // Floor
                cell.classList.add('floor');
                break;
            case 'P': // Player Spawn
                cell.classList.add('player');
                break;
        }

        // Append the cell to the grid
        grid.appendChild(cell);
    });
});
