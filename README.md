# Dice-Game 🎲🎮
A multiplayer online dice game using Node js, Socket.io, Express and vanilla Javascript

## Points to be consider 📌
- In the beginning, you have to input the room name and the name of the player.
- A maximum two players can be a part of a single room as it is a two-player game.
- You going to join the room in case your entered room is available and someone waiting.
- You going to create the room and wait for your Opponent in case your entered room is not available.
- Once you come into the room, you can see your room name by clicking on the dice. ( you can hide and unhide the room name by clicking on the dice )
- If your opponent leaves the room during the game, your ongoing game will be lost immediately.
- The person who created the room gets the first turn to play the game.
- Whenever it is a player's turn, their player panel is highlighted. ( This allows the players to easily identify whose turn it is at the moment )

## Game interaction 🦋
- You can roll the dice by clicking the '**ROLL DICE**' button.
- You can hold your current score by '**HOLD**' button.

(**Note : These buttons are disabled when it is your opponent's turn**)

## Game Rules 🎲📝
- You can roll the dice as many times as you want. each time, the number that comes up on the dice will be added to your current score.
- Your current score will be added to your overall score when you click the 'Hold' button. ( When you click the 'Hold' button, your turn will end and your current score will be reset to 0. )
### But here is the twist 😅👇👇
- **If you roll a 1 on the dice, your turn will end and your current score will be reset to 0 without being added to your overall score.**

## Winning Condition 🎉🎊🥳
- **The first player who reaches an overall score of 100 wins the game.**

### Live demo : https://dice-game-chirag.onrender.com
