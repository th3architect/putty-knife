// the purposes of this scraper example is to collect the content-type for each
// page in a hierarchy of pages. The resulting data will look like
//
// {
//   "http://example.com": "text/html",
//   "http://example.com/som-page.html": "text/html",
//   "http://example.com/images/something.png": "image/png"
// }
//
// this specific example will be scraping http://nodejs.org/dist/latest/

// dependencies
var pk = require("./");
var path    = require("path");

// this demo uses superagent to make HTTP requests, you can use whatever you like
var request = require("superagent");

// this demo uses cheerio for parsing HTML responses and crawling links, you can
// use jsdom or whatever else you like
var cheerio = require("cheerio");

// a variable where we will store the content type of each scraped page
var data = {};

// in this generic example, we will define a single scrape handler for all urs
// see the API for documentation on the function parameters
function scrape(q, url, next) {

  // HEAD request on url
  console.log("HEAD %s", url);
  request.head(url).end(function(res) {

    // store content type for this url
    data[url] = res.type;

    // if non text/html, stop crawling
    if (res.type !== "text/html") {
      return next();
    }

    // content type is text/html, keep scraping ...

    // GET request on url
    console.log("GET %s", url);
    request.get(url).end(function(res) {

      // load text response into cheerio
      var $ = cheerio.load(res.text);

      // find all links
      $("a[href]").each(function(idx, elem) {

        // resolve canonical url from link href attribute
        var href = $(elem).attr("href");
        var newUrl = pk.resolveUrl(url, href);

        // skip links out of this domain
        if (!pk.inDomain(url, newUrl)) return;

        // skip paths above this direcotry for this demo
        if (/^\.\./.test(path.relative(url, newUrl))) return;

        // skip scraping the api
        if (/api/.test(newUrl)) return;

        // enqueue non-skipped urls
        q.enqueue(newUrl, scrape);
      });

      // done with this url
      next();
    });
  });
}

// start at our entry URL and pass our scraper in
// a queue is returned
var queue = pk.scrape("http://nodejs.org/dist/latest/", scrape);

// when scraping is finished, and `end` event is emitted
// now we can jsonify the data and output it to the console
queue.on("end", function() {
  console.log(JSON.stringify(data, null, "\t"));
});
