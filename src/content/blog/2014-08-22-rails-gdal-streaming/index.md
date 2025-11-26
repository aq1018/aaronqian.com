---
title: Streaming GeoJSON with GDAL, Rack::Chunked, and Rails Live Streaming
description:
  Optimize Rails API performance with streaming techniques for large GeoJSON
  responses.
lastUpdatedOn: 2014-08-22
tags:
  - ruby
  - rails
  - api
  - streaming
  - optimization
---

## TL;DR

For you busy folks who just want it to work, here is the
[gist](https://gist.github.com/aq1018/e3512f763d42ad8cf80b).

## Background

A few weeks ago, I was at [NationBuilder](https://nationbuilder.com/) building a
[GeoJSON](https://geojson.org/) API for organizers. The end goal for this
project is to provide accurate political districting information through this
API and exposes a map management interface for district updates.

## Application Architecture

This application is built on top of the popular
[Ruby On Rails](https://rubyonrails.org/) framework, and uses
[PostGIS](https://postgis.net/) as geographic data storage backend. GeoJSON
conversion is done by using [rgeo-geojson](https://github.com/rgeo/rgeo-geojson)
gem since it fits nicely with
[activerecord-postgis-adapter](https://github.com/rgeo/activerecord-postgis-adapter).

## Performance Issues

The application was initially running smoothly, but problems started to emerge
when the generated GeoJSON data became larger over time. The API server would
often time out, stop responding, or run out of memory when GeoJSON response size
approached a couple MB under light load. As a result, map rendering became so
slow and unstable, it was painful to use.

### Memory Bloat

Our GeoJSON data was initially loaded from database by ActiveReocrd, and then
converted into `RGeo::Geometry` objects. The entire dataset is buffered in
memory. These objects are then converted into hashes with `rgeo-geojson`. These
converted hashes represents takes up a lot of memory as well. Finally the
resulting hashes are merged with other database properties and pushed on an
array. All buffered in memory!

### Response Time

The application spends the majority of its time converting `RGeo::Geometry`
objects into GeoJSON hashes. The CPU will hit 100% and memory will steadily
clime. Upon closer inspection, I found out that `rgeo-geojson` gem does the
conversion entirely in Ruby! When the dataset gets too big, the browser or our
proxy will either run out of patience and issue timeouts or our application
process will have consumed so much memory it was killed by
[monit](https://mmonit.com/monit/).

### Understanding Root Cause

As all seasoned software engineers would do, I first analyzed the symptoms at
hand and concluded the following root cause:

- GeoJSON rendering is too slow.
- dataset buffering causes memory bloat.

## Research, Research, Research!

My initial effort was focused on solving the rendering speed issue. I know I
cannot convert GeoJSON in ruby since ruby isn't exactly suitable for this kind
of heavy duty data crunching when speed is a core requirement.

### The PostGIS route

The immediate thought came to mind is to have PostGIS generating the GeoJSON for
me, and I found out [st_asgeojson](https://postgis.net/docs/ST_AsGeoJSON.html).
However, this doesn't solve my problem since I will have to convert the
generated GeoJSON back into hashes and merge database properties. There's gotta
be a better way!

### GDAL

After some more research I found out a little commandline tool called `ogr2ogr`
from the wonderful [GDAL](https://gdal.org/en/stable/) library. This tool can
execute supplied SQL statements and convert the results into GeoJSON
FeatureCollection. This is perfect!

Here is an example on how to use it:

```bash
ogr2ogr -f GeoJSON /vsistdout/ \
  "PG:host=<host> dbname=<dbname> user=<user> password=<password>" \
  -sql "SELECT name, geom FROM regions LIMIT 100"
```

The `-f` flag indicates the output format, in this case I used GeoJSON.
`/vsistdout/` means I want to output the geojson directly to STDOUT.

I gave it a spin, and the rendering speed is blazing fast! Ok, I'm sticking with
it!

### Interfacing with Rails

In order to construct the command, I need to convert an ActiveRecord Scope into
SQL statements.

### SQL Statement

This is easy enough. `#to_sql` method on ActiveRecord scope will do the trick.
If you are using Rails 4, don't forget to wrap this method inside
`scope.connection.unprepared_statement` block to generate the full statement.

Something simple like this would do:

```ruby
def sql
  @scope.connection.unprepared_statement { @scope.to_sql }
end
```

### DB Connection String

The next step is to fetch the Rails database configuration and convert it into
the db connection string expected by `ogr2ogr`. Here is a snippet:

```ruby
def conn_str
  db_config = Rails.configuration.database_configuration[Rails.env]

  host      = db_config['host']
  port      = db_config['port']
  database  = db_config['database']
  username  = db_config['username']
  password  = db_config['password']

  args = []

  args.push "host=#{host}" if host
  args.push "port=#{port}" if port
  args.push "dbname=#{database}" if database
  args.push "user=#{username}" if username
  args.push "password=#{password}" if password

  "PG:\"#{args.join(' ')}\""
end
```

### Stitching It Togther

The entire command is constructed as follows:

```ruby
def command
  [
    # the command name
    'ogr2ogr',

    # output geojson to stdout
    '-f', 'GeoJSON', '/vsistdout/',

    # postgres db config
    conn_str,

    # SQL statement to run
    '-sql', "\"#{sql}\""
  ].join(' ')
end
```

### Running the command

Run the generated command as a sub-process and get the STDOUT as an IO object.

```ruby
def run
  IO.popen(command)
end
```

Yay! Fast GeoJSON rendering!

## Rails Live Streaming

You can read to the end of the IO stream and just send it off, but where is the
fun? Let's stream the response back with HTTP 1.1 chunked encoding in a 4KB
buffer! This improves response time and reduces memory footprint. Sweet deal!

### Add Chunked Enocding Support to Rails

In order to support chunked encoding, we need to add this into our
`config/application.rb` file:

```ruby
# config/application.rb
module MyApp
  class Application

    #
    # other rails application configurations
    #
    # ...

    # Add Rack::Chunked before Rack::Sendfile
    config.middleware.insert_before(Rack::Sendfile, Rack::Chunked)
  end
end
```

This inserts the `Rack::Chunked` middleware into the correct position of Rails
middleware stack to support HTTP 1.1 chunked encoding.

### Aligning The Stars, Er... I mean Interfaces

#### ActionController::Metal Streaming Interface

Since I was building an API, I used `ActionController::Metal` instead of
`ActionController::Base` with is a much smaller abstraction for `Rack`
interface. The response body is set by using `#response_body=` method.

In order to use chunked encoding, We need to give `#response_body=` method an
object that responds to `#each` and optionally `#close`, where `#each` will
yield data in chunks, and `#close` is required if you need to close underlaying
file descriptors or any cleanup operations. The goal is to wrap the `ogr2ogr` IO
stream object to something that `#response_body=` expects.

#### Ruby IO Interface

Ruby [IO](https://ruby-doc.org/core-2.1.2/IO.html) class already implements
`#each` and `#close` methods. However the behavior of `#each` is not ideal in
our use case. `IO#each` is an alias to `IO#each_line` which yields data line by
line. `ogr2ogr` generates the GeoJSON in a single gigantic line. We need to
split each chunk by byte size instead of by line.

Luckily, Ruby IO offers a nice method called `#readpartial` that takes a
`maxlen` argument. This argument tells the IO stream how many bytes read. When
invoked, the IO object will wait until enough bytes are available and return a
string with the requested byte size (or less if end of the stream is reached, or
raises EOFError).

#### Chunking IO Stream

With the long explanation above, we are now equipped with enough knowledge to
create a wrapper to handle the chunking. It turns out pretty simple:

```ruby
# lib/chunked_stream.rb

#
# ChunkedStream
#
# It takes any IO object and reads the output in chunks.
# It implements #each and #close and is designed to be used
# to interface with Rails Live Stream or Rack::Chunked
#
class ChunkedStream
  CHUNK_SIZE = 1024 * 4 # read in 4 kB size

  attr_reader :io, :chunk_size

  def initialize(io, chunk_size = CHUNK_SIZE)
    @io = io
    @chunk_size = chunk_size
  end

  def each
    while chunk = io.readpartial(chunk_size)
      yield chunk
    end
  rescue EOFError => e
    nil
  ensure
    close
  end

  def close
    io.close
  end
end
```

Now we have all the Lego pieces in place! let's put them in good use:

```ruby
# In your ActionController::Metal sub class
# that generate the geojson
#
def index
  scope = Region.all

  io = GeojsonCommand.new(scope).run

  self.status = :ok
  self.content_type = 'application/json'
  self.response_body = ChunkedStream.new(io)
end
```

### Bonus Stage: On The Fly Compression for Chunked Encoding

Somewhere during the research, I came across
[Rack::Deflater](https://thoughtbot.com/blog/content-compression-with-rack-deflater).
This is a middleware that checks for `Accept-Encoding` in request headers, and
compresses your response on the fly!

The trick to get it working with `Rack::Chunked` is to insert this middleware
right after `Rack::Chunked`. This is because we need to compress each data
chunk, instead of the entire request.

To enable compression, all you need to do is add the following line in your
`config/application.rb`:

```ruby
config.middleware.insert_after(Rack::Chunked, Rack::Deflater)
```

## Caveats

Although the speed has been significantly improved. There are still some caveats
to watch for.

### ogr2ogr Sub-Process Error Handling

Currently the code assumes `ogr2ogr` sub-process can run successfully all the
time, and we all know this is unrealistic. A better error handling process is
needed to make it more solid.

### Under Large Load

Under high load, many `ogr2ogr` sub-processes will be created. The behavior
under this situation is unknown. But this is an internal API with very light
traffic. Thus this is not a concern for me (yet). I think some kind of
in-process worker pool and monitor could mostly solve this issue, but I have no
plan to implement this for now.

## Go Try It Out!

Here is a [gist](https://gist.github.com/aq1018/e3512f763d42ad8cf80b) for you to
try it out. Let me know your results / opinions / rants! All is welcome!
