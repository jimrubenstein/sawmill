var net		= require('net'),
	path	= require('path'),
	sys		= require('sys')//,
	//Worker	= require('webworker').Worker;

/* Logger needs to:
 * Read STDIN for message + identifier
 * Send identifier + message to the mill
 *  - Buffer sends so we're not flooding the network constantly (flush every 10s?)
 * If mill goes down, write data locally until it comes back online
 * If no mill connection, continue trying to connect to the mill to send logs
 * Monitor the config file in case the mill server needs to change
**/
function Mill()
{
	var self = {};
	
	self.init = function()
	{
		self.server = net.createServer(self.connected).listen(12345);
	}
	
	self.connected = function(stream)
	{
		stream.addListener('data', procLog);
	}
	
	function procLog(data)
	{
		data = data.toString().split("\n");
		
		while (data.length > 0)
		{
			line = data.shift().trim();
			
			var identifier	= line.substring(0, line.indexOf(' ')),
				log			= line.substring(line.indexOf(' ') + 1).trim();
			
			if (log.length == 0)
			{
				continue;
			}
			
			
		}
	}
	
	self.init();
	
	return self;
}

exports.Mill = Mill;

var Log = function(identifier)
{
	var fd = null,
		fileSize = 0;
		
	try
	{
		var stats = fs.statsSync(identifier);
		if (stats.isDirectory())
		{
			this.fd =
		}
	}
	catch (e)
	{
		
	}
}