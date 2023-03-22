# readfeed

An impatient incomplete feed reader because I’m stingy and lazy

Uses <https://github.com/MikaelPorttila/rss>

I do this:

```
$ deno compile --allow-read --allow-write --allow-net readfeed.js
```

then:

```
$ ./readfeed      
```

Feeds are in a text file called feeds.txt.

Output is in `feeds.json` and a miserable `feeds.html` file.

That is all. 