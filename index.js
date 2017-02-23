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
bot.on('message', message => {
  //Exit if wrong channel or not our bot prefix
  if (!message.content.startsWith(config.bot.commandPrefix) || message.channel.name != config.bot.workingChannel) return;

  var caughtCommand = message.content.substring(config.bot.commandPrefix.length).trim();

  //Checking if we got the caught command configured and executes it different depending on command type.
  for (var cmd in config.bot.commands) {

    if (caughtCommand == config.bot.commands[cmd].trigger) {

      if (config.bot.commands[cmd].type == 'text') {
        message.channel.sendMessage(config.bot.commands[cmd].execute);
      }
      else if (config.bot.commands[cmd].type == 'reply') {
        message.reply(config.bot.commands[cmd].execute);
      }
      else if (config.bot.commands[cmd].type == 'pm') {
        //send PM, not implemented.
      }
      else if (config.bot.commands[cmd].type == 'module') {
        //Excecute a function command for more complex commands.
        try {
          modules[config.bot.commands[cmd].execute].run(message);
        }
        catch (e) {
          message.reply('I failed to excecute the command \'' + caughtCommand + '\'!');
          console.log(e);
          return;
        }
      }
      //We handled the command.
      return;
    }
  }
  
  //Command not found in config.
  message.reply('Unknown command: \'' + caughtCommand + '\'.');
});

///////
//This event raises when the bot is loaded and ready.
////
bot.on('ready', () => {
  console.log('Bot ready! Running on version:', config.version);
  //Setting the "Playing game:"-text that shows in discord.
  bot.user.setGame(config.bot.playingGameText);
});

//Start.
main();