var request = require('request'),
    config = require('./config.json');


function getGuildReports(guildName, guildServer, guildRegion, callback) {
    var url = config.api.baseUrl+'reports/guild/' + guildName + '/' + guildServer + '/' + guildRegion + '?api_key=' + config.api.apiKey.public;
        
    request(url, function(error, response, body) {
        if (error){
            console.log('error:', error);
            return error;
        }

        callback(JSON.parse(body));
    });
};

module.exports = {

    run: function(discordMessage, caughtString) {
        
        getGuildReports(config.api.guildName, config.api.guildServer, config.api.guildRegion, function(data){
            
            var max = data.length,
                baseReportUrl = config.api.baseReportUrl,
                reportDate = '',
                msgString = 'These are the most recent Warcraft Logs for Carpe Cerevisi\n\n';

            for (var i=1; i<=3; i++) {
                reportDate = new Date(data[max-i].start).toISOString().substr(0,10);
                msgString += i+'. '+reportDate+' - '+data[max-i].title+'\n';
                msgString += '\t'+baseReportUrl+data[max-i].id+'\n';
            }
            
            discordMessage.channel.sendMessage(msgString);
        });
        
    }
};


/*
{ id: 'MyntWL62Cagxzpcw',
    title: 'Emerald Nightmare',
    owner: 'Varila',
    start: 1488136311884,
    end: 1488145991332,
    zone: 10 }
    

https://www.warcraftlogs.com:443/v1/classes?api_key={Your_key_here}

816ed03da1f3cf30e8c69df8f407deaf



reports
https://www.warcraftlogs.com:443/v1/reports/guild/Carpe%20Cerevisi/moonglade/eu?api_key=816ed03da1f3cf30e8c69df8f407deaf



https://www.warcraftlogs.com/reports/6xR1TzVQhf8FAd4t




var request = require('request');
request('http://www.google.com', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body) // Print the google web page.
     }
})




var request = require('request');
request('http://www.google.com', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});


!carpe wcl



{
  "status": 401,
  "error": "Invalid key specified."
}
Response Code
401
Response Headers
{
  "date": "Tue, 28 Feb 2017 15:18:27 GMT",
  "content-encoding": "gzip",
  "server": "Apache",
  "vary": "Accept-Encoding",
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": "*",
  "cache-control": "no-cache",
  "connection": "keep-alive",
  "content-length": "70"
} 

*/