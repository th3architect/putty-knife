var pk = require("./");
var request = require("superagent");
var cheerio = require("cheerio");
var fs      = require("fs");
var path    = require("path");

if (!process.argv[2] || !process.argv[3]) {
  console.error("usage: node <scraper-path> <url> <output-path>");
  process.exit();
}

var data = {};

function scrape(q, url, next) {
  console.log("GET %s", url);
  request.get(url).redirects(0).end(function(err, res) {

    // log network errors
    if (err) {
      data[url] = "network error: " + err.message;
      console.error("network error:", err);
      return next();
    }

    // log non-200 responses
    if (res.status !== 200) {
      data[url] = "status error: " + res.status;
      console.error("status error:", res.status);
      return next();
    }

    // skip non html responses
    if (res.type !== "text/html") {
      data[url] = "skipped type: " + res.type;
      console.log("skipping %s", res.type);
      return next();
    }

    // load response into cheerio
    try {
      var $ = cheerio.load(res.text);
    }

    // catch cheerio errors
    catch (e) {
      data[url] = e.message;
      console.error("cheerio fail: %s", e);
      return next();
    }

    // find all links in page
    $("a[href]").each(function(idx, elem) {

      // resolve aboslute URL
      try {
        var href   = $(elem).attr("href");
        var newUrl = pk.resolveUrl(url, href);
      }

      // skip bad urls, (mailto:, etc)
      catch (e) {
        return;
      }

      // filter rubbish
      if (!pk.inDomain(url, newUrl)) return;
      if (/#/.test(newUrl)) return;
      if (/clock/.test(newUrl)) return;
      if (/poker-videos/.test(newUrl)) return;
      if (/tournament-schedule/.test(newUrl)) return;
      if (/user_offers/.test(newUrl)) return;
      if (/show_promotion/.test(newUrl)) return;
      if (/hand-history/.test(newUrl)) return;
      if (/\.(jpg|png|gif)/i.test(newUrl)) return;

      // recurse
      q.enqueue(newUrl, scrape);
    });

    data[url] = {
      title:       $("title").text(),
      description: $("meta[name=Description]").attr("content"),
      keywords:    $("meta[name=Keywords]").attr("content")
    };

    console.log(data);
    next();
  });
}

var queue = pk.scrape(process.argv[2], scrape);

queue.on("end", function() {
  var out  = path.resolve(process.cwd(), process.argv[3]);
  var json = JSON.stringify(data);

  fs.writeFile(out, json, function(err) {
    if (err) {
      console.error("file error: could not write to %s; ", out, err);
      return console.log("falling back to stdout:\n", json);
    }
    console.log("saved data to %s", out);
  });
});
