# Dead-Hunt

<p align = "center">
<img src="https://github.com/Goel-Bhavye8302/dead-hunt/blob/main/public/assets/Screenshot%202023-05-08%20180329.png">
</p>

<p align="center">
A unique soft skills assessment experience that combines the excitement of a treasure hunt, the effectiveness of storytelling, and the challenge of puzzles, resulting in an innovative and immersive experience.
</p>

## Features 
Listed below are all the feature included in the project

### Game Featues 

- [x] 5 Stages of the game : Level 1 to 5

- [x] Soft skills assessed 

  1. Critical Thinking
  2. Memory
  3. Patience
  4. Problem Solving
  5. Eye for Detail
  6. Resource Management

- [x] Multiple Dead Ends
  1. Downloads Folder 
  2. Movies Folder 
  3. Solution.txt File
  4. Lol.txt
  
- [x] 8 Clues 
  
- [x] User Leaderboard

- [x] Admin Panel

- [x] Each user's analytics in admin panel

- [x] Ability to review previous stage information if stuck on a certain stage

- [x] Exit to save game and Restart to restart a new game

### Authentication 

- [x] User Sign up
- [x] User Sign in
- [x] Sign up to Sign in automatic flow transfer 
- [x] Single page for auth 
- [x] Same login page for admin
- [x] Admin decided by auth metadata 

### Authorization 

- [x] Play game
- [x] Access user leader board
- [x] Access result analysis
- [x] Only admin can access Admin Panel

## Screenshots 

<p align = "center">
<img src="https://github.com/Goel-Bhavye8302/dead-hunt/blob/main/public/assets/1.png">
</p>

<p align = "center">
<img src="https://github.com/Goel-Bhavye8302/dead-hunt/blob/main/public/assets/2.png">
</p>

<p align = "center">
<img src="https://github.com/Goel-Bhavye8302/dead-hunt/blob/main/public/assets/3.png">
</p>

<p align = "center">
<img src="https://github.com/Goel-Bhavye8302/dead-hunt/blob/main/public/assets/4.png">
</p>

<p align = "center">
<img src="https://github.com/Goel-Bhavye8302/dead-hunt/blob/main/public/assets/5.png">
</p>

# Game Description

This game follows a simulation of a linux terminal in which user has to find commands, files, and folders through clues and hints available throughout the game.
The player can skip through levels and clues to the later clues or even final solution but they will receive lesser scores.
There is a virus meter always active which increases on certain actions in game. The game ends if the bar reaches 100%.

## Level 1:
Player has to solve the first clue to find the first few useful commands.
```
Why do you wanna go home? Why are you in such a hurry? Can't find what you're looking for? Maybe you wanna change the directory?"
```
clues: `change the directory, home`
command: `cd home`
hint: `shout help!`
-> using the command 'help' user can see the command available to change the directory to home 


## Level 2 & Level 3:
Player has to explore folders & files using commands available until they reach the folder '/home/virus/openMe!' which contains next clues

clues: `2 files named 0000000000100010.txt, 1111111110001010.txt, help.txt`

hints: `What cute animal displays file contents ?,  what hills ?`

solution:`cat`

Player has to use the cat command to display contents of the 2 files.

They have to decode 0000000000100010 as 34 and 1111111110001010 as -118 using a binary to decimal converter.

`They will have 4 numbers -> 34, -118, .1641007, .6673609`
After combining these numbers, player can get 2 numbers 34.1669827 & -118.6693103 which represent map co-ordinates that lead to a place called Hidden Hills.

The hint 'what hills' focuses on 'Hidden' part of the answer giving a slight hint to think of something hidden.


## Level 4:
Upon displaying the contents of the file 'solution.txt', the player gets another clue 'Aparecium' which is a famous spell from Harry Potter franchise used to reveal hidden items.
This gives a clue to reveal something which is hidden.

Upon searching on google the player can find the command to find hidden files.
command: `ls -a`

When the player runs this new command, a new file '.solution.txt' appears. 
The player must display its contents for next clue.


## Level 5:
The player has to use the available hint 'I am more of a dog person!' to know that they have to replace the command 'cat' with 'dog' which displays contents of the new hidden file.

the file contents are: `arvadekadava`
The last command is simple in which the player has to reverse the given clue to form 'avadakedavra' which is another famous spell from Harry Potter used to kill people.
In this scenario we can use this command to kill the virus.
Typing `avadakedavra` on the terminal wins the game.


# Technical Details

- [T3 Stack](https://create.t3.gg/)
- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [Clerk](https://clerk.com/)
- [PlanetScale](https://planetscale.com/)
- [Vercel](https://vercel.com/)

# Project Setup

## Prerequisites 

1. An installation of [Node.js v18.13.0 (npm v8.19.3)](https://nodejs.org/en/download/)
2. A database based on Prisma on [PlanetScale](https://planetscale.com/)
3. A project on [Clerk](https://clerk.com/)

## Install Project
    $ git clone https://github.com/Goel-Bhavye8302/dead-hunt.git
    $ cd dead-hunt

## ENV Variables Setup
- Copy the ENV variables from Clerk & PlanetScale into a new .env file. Check .env.example file for reference.

## Run the app
    $ npm install
    $ npx prisma db push
    $ npx prisma generate
    $ npm run build
    $ npm run start
