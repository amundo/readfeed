import { parseFeed } from 'https://deno.land/x/rss/mod.ts';


const wtf = await Deno.readTextFile('feeds.txt')

const urls = wtf
  .trim()
  .split('\n')

let feeds = [] 

for await(let url of urls){
  console.log(`\ngetting ${url}…`)
  let response = await fetch(url)
  let xml = await response.text()
  let feed = await parseFeed(xml)
  feeds.push(feed)
}


let entries = feeds.flatMap(feed => feed.entries)

entries.sort((a,b) => a.published < b.published ? 1 : -1)

let renderEntry = entry => `<div class=entry>
<a href="${entry.links[0].href}">${entry.title.value}</a> [${entry?.author?.name || "anonymous"}]
</div>
`

let renderEntries = entries => `
<!doctype html>
<title>feed</title>
<meta charset=utf-8>
<body>
  ${entries.map(renderEntry).join('\n')}
</body>
`
  
await Deno.writeTextFile('feeds.html', renderEntries(entries))

await Deno.writeTextFile('feeds.json', JSON.stringify(entries, null, 2))
Deno.exit()
