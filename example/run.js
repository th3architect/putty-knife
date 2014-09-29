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
//

// you're going to need putty-knife, so require that here
var pk = require("../");

// we will initialize our data reduction with {}
// our entry URL is "http://nodejs.org/dist/latest"
// our scrape handler for this url is "./scrapers/head"
// the return value is a Queue instance
var queue = pk.scrape({}, "http://nodejs.org/dist/latest/", require("./scrapers/head"));

// when scraping is finished, and `end` event is emitted
// the reduced data is sent to the end event handler
// we can jsonify the data and output it to the console
queue.on("end", function(data) {
  console.error("scraping is done!");
  console.log(JSON.stringify(data, null, "\t"));
});
