var net		= require('net'),
	sys		= require('sys'),
	fs		= require('fs');
	
	
var logFile = fs.createWriteStream('/Users/jrubenstein/Sites/personal/sawmill/sawmill/test.txt', { mode: '0664', flags: 'w+', encoding: 'utf8'});

function connected(stream)
{
	//stream.resume();
	
	stream.addListener('data', procMessage);

	logFile.write('CONNECTED BITCHES!');
	/*
	fs.open("text.txt", 'w+', 664, function(err, fd)
	{
		if (err) throw err;
		
		logFile = fd;
	});*/
}

onmessage = function(msg)
{
	console.log('message received');
	process.stdout.write('got new message. woot.');
	
	var s = new net.Stream(msg.fd);
	
	s.type = server.type;
	s.server = server;
	
	logFile.write('received message!');
	
	//s.addListener('connection', connected);
	s.resume();
	s.emit('connection', s);
}

function procMessage(data)
{
	logFile.write(data);
	
	//fs.write(logFile, data, null, 'utf8');
}

var server = net.createServer(connected);
