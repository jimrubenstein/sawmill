exports.Logger = require('./logger').Logger;
exports.Mill = require('./mill').Mill;

function printUsage()
{
	process.stdout.write("Usage: \n");
}
exports.printUsage = printUsage;

function missingIdentifier()
{
	
	printUsage();
}
exports.missingIdentifier = missingIdentifier;

function invalidIdentifier()
{
	
	printUsage();
}
exports.invalidIdentifier = invalidIdentifier;

function missingMode()
{
	
	printUsage();
}
exports.missingMode = missingMode;

function invalidMode()
{
	
	printUsage();
}
exports.invalidMode = invalidMode;