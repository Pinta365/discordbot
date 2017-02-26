const Discord = require('discord.js'),
      bot = new Discord.Client(),
      config = require('./config.json'),
      modules = require('./modules');

//The main function that makes it all happen.
function main() {

  //This logs the bot in with the discord token specified in the config.json
  bot.login(config.bot.token);

  //Loop through modules and add their commands to the bot dynamically.
  for (var mod in modules) {
    config.bot.commands[modules[mod].config.command.execute] = modules[mod].config.command;
  }
}

///////
//This event raises when the bot reads a message in a channel.
////
bot.on('message', discordMessage => {
  //Exit if message is caught in wrong channel or not our bot prefix
  if (!discordMessage.content.startsWith(config.bot.commandPrefix) || discordMessage.channel.name != config.bot.workingChannel) {
    return;
  }

  var caughtString = discordMessage.content.substring(config.bot.commandPrefix.length).trim(),
      command = caughtString.split(' ')[0],
      botCommands = config.bot.commands;

  //Checking if we got the caught command configured and executes it different depending on command type.
  for (var cmd in botCommands) {

    if (botCommands[cmd].trigger == command) {

      switch (botCommands[cmd].type) {

        case 'text':
          discordMessage.channel.sendMessage(botCommands[cmd].execute);
          break;

        case 'reply':
          discordMessage.reply(botCommands[cmd].execute);
          break;

        case 'pm':
          //send PM, not implemented.
          break;

        case 'module':
          //Excecute a function command for more complex commands.
          executeModule(modules[botCommands[cmd].execute], discordMessage, caughtString);
          break;

        default:
          console.log('Unknown command type: \'' + botCommands[cmd].type + '\'. Is the configuration right?');
          discordMessage.reply('Unknown command type: \'' + botCommands[cmd].type + '\'.');
      }

      //We found the command.
      return;
    }

  }

  //Command not found in config.
  console.log('Unknown command: \'' + command + '\'.');
  discordMessage.reply('Unknown command: \'' + command + '\'. Try \'' + config.bot.commandHelp + '\'');

});

//Executes a modules run-function along with the discordMessage object and the caught command string. 
function executeModule(module, discordMessage, caughtString) {
  try {
    module.run(discordMessage, caughtString);
  }
  catch (e) {
    discordMessage.reply('I failed to excecute the command \'' + discordMessage + '\'!');
    console.log(e);
    return;
  }
}

///////
//This event raises when the bot is loaded and ready.
////
bot.on('ready', () => {
  console.log('Bot ready! Running on version:', config.version);
  //Setting the "Playing game:"-text that shows in discord.
  bot.user.setGame(config.bot.commandHelp);
});

//Start.
main();