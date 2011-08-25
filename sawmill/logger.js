net = require('net')

/* Logger needs to:
 * Read STDIN for message + identifier
 * Send identifier + message to the mill
 *  - Buffer sends so we're not flooding the network constantly (flush every 10s?)
 * If mill goes down, write data locally until it comes back online
 * If no mill connection, continue trying to connect to the mill to send logs
 * Monitor the config file in case the mill server needs to change
**/
function Logger(identifier)
{
	var self = {};
	
	self.connect = function()
	{	
		self.connectRetries++;
		
		self.mill = net.createConnection(self.config.port, self.config.host);

		self.mill.addListener('connect', self.onConnected);
		self.mill.addListener('error', self.onError);
		self.mill.addListener('close', self.onClose);
	}

	self.onConnected = function(socket)
	{
		self.connectRetries = 0;
	}

	self.onError = function(exception)
	{
	}
	
	self.onClose = function(had_error)
	{
		if (had_error)
		{
			//oh noes! there was an error! what do we do!? We can't use the sawmill to log it..because it's down! write to file???
		}
		
		setTimeout(self.connect, 1000 * ( self.connectRetries * 2));
	}

	self.startLogging = function()
	{
		process.stdin.resume();
		process.stdin.on('data', self.procLog);
	
		self.flushTimer = setTimeout(self.flush, self.flushInterval); //flush ever 10s
	}

	self.procLog = function(chunk)
	{
		chunk = chunk.toString().trim();
	
		chunk = chunk.split("\n");
		
		for (var i = 0; i < chunk.length; i++)
		{
			self.buffer += self.identifier + " " + chunk[i] + "\n";
			
			if (self.buffer.length > self.config.maxBuffer)
			{
				self.flush();
			}
		}
	}

	self.flush = function()
	{	
		clearTimeout(self.flushTimer);
		self.flushTimer = setTimeout(self.flush, self.flushInterval);
		
		if (self.buffer.length > 0 && self.mill && self.mill.readable)
		{
			console.log(self.buffer);
			
			var flushData = self.buffer.split("\n");
			self.buffer = '';
		
			self.lastFlush = Math.round(new Date().getTime() / 1000);
			
			while (flushData.length > 0)
			{
				var lineData = flushData.shift();	
				self.mill.write(lineData + "\n");
			}
		}
	}	
	
	self.mill = null;
	
	self.config = {
		host: '192.168.1.116',
		port: 12345,
		maxBuffer: 1040000 //bytes
	};
	
	self.identifier = '';
	self.buffer = "";
	self.lastFlush = 0;
	self.flushTimer = null;
	self.flushInterval = 1000;
	self.connectRetries = 0;
		
	self.identifier = identifier;
	
	self.connect();
	self.startLogging();
	
	return self;
};


exports.Logger = Logger;
