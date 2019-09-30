# Beat The Glock

This game is a musical version of 'Simon Says'. 

## Gameplay

It is a two-player game, which commences when a player challengers another player in the lobby. The second player is sent an invitation to join the game, and is then taken to a unique URL to join the game. 

Gameplay comprises of the following steps:

- Player 1 is presented with a glockenspiel and is required to play a note to start the melody.
- Player 2 then listens to it and guesses the note by playing it on the glockenspiel.
- If correct, Player 2 adds a note to the melody and then it is Player 1's turn to guess. 

This process of listening, guessing and adding notes happens cyclically until a player guesses the melody incorrectly and the game ends.

## Architecture

### Client

- Vue JS
    - Vue Router
    - Vue X
    - Socket IO client
    - D3

Both the routes and the store are located in the `main.js` file. 

Routes include:

- `/` Home screen/Lobby
    - Login/Username component
    - Challengers component (select a challenger to start new game)
- `/leaderboard` 
- `/stats`
- `/play/:id/:player`
    - `id` referring to the game ID stored in MongoDB
    - `player` referring to the player number (i.e. `1` for player 1)
    - URL can be revisited with current game data

The store contains data relevant to the client, including the player's `username` entered via the lobby, the home route) which allows them to play multiple games and chat with the same username, and an `invitation` object, which exists if another player has challenged them with the game details.

### Server

- Express
- MongoDB & Mongoose
- Socket IO

Endpoints push and receive data from MongoDB using Mongoose as an ORM with a game object defined in `game.js`.

### Client-Server communication

Endpoints (`endpoints.js`): 

- POST `/new`
    - Persists new game object to database with player & game mode data
    - Called from `Challengers.vue` component when a user challenges an opponent
- POST `/update`
    - Pushes updated game object to database. 
    - Called from `Game.vue` component, everytime a move is made
    - Doesn't use id as params to make code in component as neat as possible
- GET `/game/:id`
    - Retrieves game data by ID
    - Called from `Game.vue` on vue `created` lifecyle hook to retrieve current game data from database
- GET `/all`
    - Gets all active & closed games from DB
    - Called from `Leaderboard.vue` and `Stats.vue` component for data visualisation

Custom sockets events (`server.js`):

- `getUsers`
    - broadcasts an event with a list of online users
- `newUser`
    - broadcasts new game object
- `move`
    - accepts game object as parameter with updated data, and broadcasts the entire object to listeners
- `addMsg`
    - accepts a message object, and broadcasts entire object to listeners


## Backlog for V2

- namespaced sockets so events are broadcasted to specific games only
- messages databased so history can be retrieved when revisiting game URL
- user creation, allowing login with passwords and active games can be seen from dashboard, as URL parameters for player 1/player 2 is unreliable 
- intermediate mode
- ability to select different musical scales and modes 
- solo mode, similar to Glockenspiel AI but automatic moves and appears in a different leaderboard
