///////
//
//	Loop trough all files in modules/*, require all
//	     
//  (For a simple example check out the module /helloWorld)
//
var fs = require('fs'),
	path = require('path'),
	modules = {};

module.exports = (function() {
	fs.readdirSync('modules/').forEach(function(f) {
		
		if (f.match(/index\.js$/) === null) {
			try {
				var currentModule = require(path.join(__dirname, f, '/index.js'));
				
				currentModule.config = require(path.join(__dirname, f, '/config.json'));
				currentModule.config.command = {};
				currentModule.config.command.trigger = currentModule.config.trigger;
				currentModule.config.command.type = 'module';
				currentModule.config.command.execute = f;
				
				if ((currentModule.config.enabled === undefined) || currentModule.config.enabled == true) {
					modules[f] = currentModule;
				}
				
				if (currentModule.config.autorun){
					currentModule.run();
				}
			}
			catch (e) {
				console.error('Could not load module ' + f + ':', e);
			}
		}
	});
	return modules;
})();