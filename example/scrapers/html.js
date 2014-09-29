var url        = require("url");
var path       = require("path");
var pk         = require("../../");

// our html scraper
//
// handler for pk.html receives
//  * data - value sent to last `next` call
//  * q    - our queue
//  * req  - the http GET request for this url
//  * res  - the http response
//  * next - callback
//
// conveniently, res.$ is a cheerio instance loaded with res.text
//
module.exports = pk.html(function(data, q, req, res, next) {
  res.$("a[href]").each(function(idx, elem) {

    // resolve canonical url from link href attribute
    var href = res.$(elem).attr("href");
    var newUrl = url.resolve(req.url, href);

    // skip links out of this domain
    if (!pk.inDomain(req.url, newUrl)) return;

    // skip paths above this direcotry for this demo
    if (/^\.\./.test(path.relative(req.url, newUrl))) return;

    // skip scraping the api
    if (/api/.test(newUrl)) return;

    // enqueue non-skipped urls
    q.add(newUrl, require("./head"));
  });

  // done with this url
  next(data);
});
