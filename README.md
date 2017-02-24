## About
Discordbot is ment to act like a base for your own custom discord bot. You can more or less just grab an application token from discord and pull a copy of this repository and you're good to go(see installation section). It can easily be expanded with static commands as well as more complex module-based commands.

## Prerequisites
Node.js 6.0.0 is required by the [discord.js](https://github.com/hydrabolt/discord.js/) library which Discordbot is depending on to handle the API calls for discord.

## Installation
1. Create a discord app through the developer site over at [discordapp.com](https://discordapp.com/developers). Take notice of both the Client ID and the Token ID, you will need them later.
2. Clone a copy of this repository. (With git you can just issue the _git clone_ command at desired folder __git clone https://github.com/pintapoff/discordbot.git__)
3. Rename config.json.template found in the project root folder to config.json and update it with the application-token you can find at the first step.
4. Add your application(bot) to your discord server by following this link. __IMPORTANT!! change the INSERT_CLIENT_ID to your actual Client Id found at the first step IMPORTANT!!__ https://discordapp.com/api/oauth2/authorize?client_id=INSERT_CLIENT_ID&scope=bot&permissions=0 
5. Install the dependencies needed by running the command __npm install__ from the project root folder.
6. Fire it up with __npm start__ or simply __node index.js__

## Creating your own bot commands
Tailoring your bot with your own commands are really easy, there are two types of commands.
### Static commands
to be continued....

### Somplex module-based commands
to be continued....