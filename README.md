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



## Technical Details

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
