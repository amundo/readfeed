import { parseFeed } from 'https://deno.land/x/rss/mod.ts';

const wtf = await Deno.readTextFile('feeds.txt');

const urls = wtf.trim().split('\n');

let feeds = [];

for await (let url of urls) {
  console.log(`\ngetting ${url}…`);
  let response = await fetch(url);
  let xml = await response.text();
  let feed = await parseFeed(xml);
  feeds.push(feed);

  // Get the current date and format it as YYYY-MM-DD
  const date = new Date();
  const dateString = date.toISOString().slice(0, 10);

  // Get the filename from the URL and remove any special characters
  let filename = url
    .replace(/^(https?|ftp):\/\//, '') // Remove protocol
    .replace(/[^\w\s]/gi, '') // Remove non-word characters
    .replace(/\s+/g, '-') // Replace spaces with dashes
    
  if(!filename.endsWith('.xml')){
    filename = filename + `.xml`
  }
  const filenameWithDate = `${dateString}_${filename}`;

  let filePath = `feeds/${filenameWithDate}`

  // Save the RSS feed to a file with the unique filename
  await Deno.writeTextFile(filePath, xml);
}

let entries = feeds.flatMap(feed => feed.entries);

entries.sort((a, b) => new Date(b.published) - new Date(a.published));

let renderEntry = entry => `<div class=entry>
<a href="${entry.links[0].href}">${entry.title.value}</a> [${entry?.author?.name || "anonymous"}]
</div>
`

let renderEntries = entries => `
<!doctype html>
<title>feed</title>
<style>
.entry {
  padding: 1em;
}
</style>
<meta charset=utf-8>
<body>
  ${entries.map(renderEntry).join('\n')}
</body>
`

await Deno.writeTextFile('feeds.html', renderEntries(entries));

await Deno.writeTextFile('feeds.json', JSON.stringify(entries, null, 2));
Deno.exit();
