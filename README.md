# Manille server

This is the server project for my manille game. You can find the client project [here](https://github.com/Paveldel/Manille_Client).

## Quick start

This project is a simple nextJS project with only an API. You can start the server locally by cloning the repository and running `npm run dev`. Or by deploying the next project as you see fit (But keep in mind CORS is fully allowed for this project).

## Architecture

In `/src` you will find five layers for the API:  
- **Domain**: all the game rules are present here
- **Service**: wires game actions to the infrastructure chosen in main
- **Persistence**: allows games to be saved locally in JSON files
- **App**: nextJS API
- **Main**: holder of dependencies so persistence or API can be switched more easily

## Tests

there are some simple tests in the test folder for **very** basic game rules.  
They do not cover everything important!