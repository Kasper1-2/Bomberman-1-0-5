#Bomberman 

create a simple bomber man game in a 13x13 grid layout. player only needs to have logic to move around and place bombs

######

Day 1: Project Setup, Layout Design, and Game Grid Creation
Goal: Set up the project structure, design the layout, and generate the game grid.

Project Structure:

Create a 13x13 grid layout using divs, where each cell represents a game board tile.
CSS Layout:

Use CSS grid to arrange the game board cells.
Style the cells for walls, floor, player, and enemies (using placeholder colors).
Add a sidebar/header to show player score, lives, and game status.
Responsive Design:

Ensure layout scales well on different screen sizes.


######

Day 2: Player Movement and Bomb Placement
Goal: Implement player movement and bomb placement logic.

Grid Initialization:

Use JavaScript to dynamically create the 13x13 grid by generating div elements within a 2D array.
Player Object and Movement:

Define a player object with properties like position and lives.
Add movement logic with keydown events to move the player in the grid (up, down, left, right).
Add boundary checks so the player can’t move outside the grid or through walls.
Bomb Placement:

Implement logic to place a bomb at the player’s current position when a specific key is pressed (e.g., spacebar).
Create a bomb object with position and timer properties.

#####

Day 3: Bomb Explosion Logic and Collision Detection
Goal: Add bomb explosion functionality, collision detection, and basic game logic.

Bomb Explosion:
Set a 3-second timer for each bomb using setTimeout to trigger an explosion.
Implement explosion effects in a cross pattern, affecting cells up, down, left, and right.
Collision Detection:
Prevent the player from walking through walls.
Ensure explosions destroy breakable walls or enemies, and clear the bomb from the grid after exploding.
Bomb-Player Interaction:
Implement player collision with explosions to reduce lives if caught in the blast.
Update the grid and DOM to reflect changes in player lives.

#####

Day 4: Game Conditions, and Final Adjustments
Goal: Implement  win/loss conditions, and polish the game.

Enemy Object and Movement:

Create an enemy object to track position and movement.
Use random movement logic for the enemy to roam within the grid, avoiding walls.
Implement player collision with enemies, deducting lives on contact.
Game Conditions:

Set win conditions (e.g., when all enemies are destroyed) and loss conditions (e.g., when the player’s lives reach zero).
Display game status updates in the sidebar (e.g., "Game Over" or "You Win").
Polish:

Add sound effects and simple animations for explosions and movement (optional).
Test thoroughly, debug, and ensure smooth gameplay.
Implement a restart button for players to try again.

######      ######      ###### 


backlog

1. create at least one buff and debuff for players, i.e takes longer to place bombs, speed reduce, faster movement, faster explosions, etc. something in the lines of this, but only a single buff and debuff to keep the logic simple.
these will spawn randomly in the map and the player will have to walk on the grid slot that it has spawn to be able to obatin it. max duration of the buff 15 seconds. and its removed from the map if not picked up after 15 seconds.

2. increase the amount of bombs that can be placed after an x amount of time. i.e after 1 minute tthe bombs take 2 seconds to explote and players can place up to 2 bombs.

3. 