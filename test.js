var sawmill = require('./sawmill'),
	argv	= require('optimist').argv;

var mode 		= argv._.shift(),
	identifier	= argv._.shift();


if (mode)
{	
	if (mode == 'logger')
	{
		if (identifier)
		{
			if (identifier.length > 0)
			{
				sawmill.Logger(identifier)
			}
			else
			{
				sawmill.invalidIdentifier();
			}
		}
		else
		{
			sawmill.missingIdentifier();
		}	
	}
	else if (mode == 'mill')
	{
		sawmill.Mill();
	}
	else
	{
		sawmill.invalidMode();
	}
}
else
{
	sawmill.missingMode();
}