var fs = require('fs'),
    path = require('path'),
    http = require('http'),
    config = require('./config.json');

var staticServe = function(req, res) {  
    
    var fileLoc = path.resolve(__dirname + config.rootFolder);
    fileLoc = path.join(fileLoc, req.url);

    fs.readFile(fileLoc, function(err, data) {
        
        if (err) {
            res.writeHead(404, 'Not Found');
            res.write('404: File Not Found!');
            return res.end();
        }
        
        res.statusCode = 200;
        res.write(data);
        return res.end();
    });
};

var httpServer = http.createServer(staticServe);

function simc(discordMessage, simcParameters){
  
      var exportHTMLfile = (new Date().getTime()).toString() + '.html',
          player = simcParameters.substring(0, simcParameters.indexOf('-')).trim(),
          server = simcParameters.substring(simcParameters.indexOf('-') + 1).trim();
        
      //Only sim characters on servers that are eligable to join the guild. Also adding some aliases for the server names.
      if (server === 'steamwheedlecartel' || server === 'steamwheedle' || server === 'steamwheedle-cartel')
        server = 'steamwheedle-cartel';
      else if (server === 'thesha\'tar' || server === 'theshatar' || server === 'sha\'tar' || server === 'shatar' || server === 'the-shatar')
        server = 'the-shatar';
      else if (server === 'moonglade')
        server = 'moonglade';
      else {
        discordMessage.reply('I don\'t recognice the server: \'' + server + '\'. Im only allowed to sim characters on moonglade, the-shatar or steamwheedle-cartel.');
        return;
      }

      try {

        //Add parameters for the simc process.
        var parameters = ['armory=eu,' + server + ',' + player];
        parameters.push('iterations=500');
        parameters.push('calculate_scale_factors=1');
        parameters.push('html=' + __dirname+config.rootFolder+exportHTMLfile);

        discordMessage.reply('Simulation starting. Will take a few moments. (only doing 500 iterations)');
        
        //Start the simulation.
        const spawn = require('child_process').spawn;
        //const ls = spawn('simc', parameters, {cwd: __dirname+'/bin/'});
        const ls = spawn('simc', parameters);
        
        ls.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
        });

        ls.stderr.on('data', (data) => {
          console.log(`stderr: ${data}`);
          discordMessage.channel.sendMessage('SIMC ERROR: ' + data);
          return;
        });

        ls.on('close', (code) => {
          if (code !== 0) {
            console.log(`child process exited with code ${code}`);
            discordMessage.reply('Simulation done with errors: No report generated.');
          }
          else {
            console.log(`child process exited with code ${code}`);
            discordMessage.reply('Simulation done, get your report at: ' + config.servingAddress + exportHTMLfile);
          }

        });
      }
      catch (e) {
        discordMessage.reply('I failed to excecute the command \'' + discordMessage + '\'!');
        console.log(e);
        return;
      }
};

module.exports = {

  autorun: function() {
    //Runs automatically with the 
    httpServer.listen(config.port);
    console.log('httpServer listening on port:', config.port);
  },

  run: function(discordMessage, caughtString) {
    var simcParameters = caughtString.substring(config.trigger.length).trim();

    console.log('run simc...', simcParameters);
    simc(discordMessage, simcParameters);
  }

};