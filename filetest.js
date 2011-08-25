fs = require('fs')

fd = fs.createWriteStream('test.out', { mode: '0664', flags: 'w+', encoding: 'utf8'});

for (i = 0; i < 100; i++)
{
	fd.write(i + "\n");
}

fd.end();