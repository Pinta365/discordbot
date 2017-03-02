var api = require('weasel.js'),
    config = require('./config.json');

api.setApiKey(config.api.apiKey.public);

module.exports = {

    run: function(discordMessage, caughtString) {

        api.getReportsGuild(config.api.guildName, config.api.guildServer, config.api.guildRegion, null, function(err, data) {

            if (err) {
                discordMessage.channel.sendMessage(err.toString());
                return;
            }
            var max = data.length,
                baseReportUrl = config.api.baseReportUrl,
                reportDate = '',
                msgString = 'These are the most recent Warcraft Logs for Carpe Cerevisi\n\n';

            for (var i = 1; i <= 3; i++) {
                reportDate = new Date(data[max - i].start).toISOString().substr(0, 10);
                msgString += i + '. ' + reportDate + ' - ' + data[max - i].title + '\n';
                msgString += '\t' + baseReportUrl + data[max - i].id + '\n';
            }

            discordMessage.channel.sendMessage(msgString);
        });
        
    }
};
