#Sawmill
*Like Scribe. But, nodejsified*

##Why I Created This
Our applications are deployed on a cluster of web nodes.  Occasionally, we push bad code **eek**.  Since we're load balancing across a lot of nodes, our
server error logs are spread out across all of our nodes - making it a royal pain to actually see what the errors are
along with any additional information we're sending to our logs.  To overcome this issue, I want to aggregate the
logs onto a single log server where I can parse them without SSHing to 100 different server.

Also, there's the "just because I wanted to" factor.  Scribe is obviously more mature than this solution, but I wanted
to build something useful with node.js - so this kind of just made sense.

In addition to being able to parse the logs from a single place, I was inspired by Etsy's usage of their StatsD daemon,
graphite, and their constant deployment strategy.  I want a way to graph the errors that are happening throughout our
applications - and to do that, I need access to the log files.  Being able to parse them in real time, and aggregate
them simmultaneously was kind of a double win.

Plus, I hate thrift.

##How It Works
Sawmill consists of two parts.  First, there's the mill.  The mill aggregates all incoming data and writes it to a single
log file.  It buffers input and does blocks of writes, in order to manage the frequency that it's writing to the disk.
The mill receives it's data over the network, and is (currently) unencrypted.  Once this project reaches a stable point,
I'll likely add over-the-line encryption to keep network bandwidth low.  Obviously encryption will hurt performance on
each end of the transmission, but I guess if I were to need it, it'd be nice for it to be there.

The second part is the logger.  The logger (currently) accepts input from STDIN, buffers it, and then flushes it to the
mill periodically.  This allows us to leverage apache's pipe logging feature so it will integrate with apache's logging
very simply, and just work by editing a configuration file.

Each logger is required to specify an identifier.  This identifier allows the mill to group the logs into different sets.
Example usage of this would be to separate access logs and error log entires.  There's a lot of potential use cases for
this considering the log parsing on the mill will be modular.

##Usage
Node.js's process forking is...confusing.  Or, at least, it was the last time I read about it.  So, instead of trying
to figure out forking and threading in node.js, I'm just going to leverage the `forever` package (available via npm).
This package automatically daemonizes your script, and re-starts it if it crashes.  Right now, that will be good enough.
So, you will start the mill by running:

```
$ forever sawmill.js mill
```

This will start up the mill server and start listening for incoming logger connections, and start logging.

The logger will be pretty easy to implement, as it accepts data from STDIN, you just have to pipe information to it.
In the use case of Apache, we'll just edit our vhost configuration to pipe our logs to the logger like so:

```
ErrorLog "| /path/to/logger.js <vhost_identifier>"
```

Or, optionally, if you'd like to keep a local copy of the log files as well:

```
ErrorLog "| tee /path/to/my/error_log | /path/to/logger.js <vhost_identifier>"
```

#Note
Most of this is theoretical.  Sawmill is not production ready yet and the functionality is how I envision it to work.
Hopefully I'm right and I won't have to make any/many structural changes as I progress further.