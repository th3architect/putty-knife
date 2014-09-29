var pk         = require("../../");

//
// our head scraper
//
// handler for pk.head recieves
//  * data - value sent to last `next` call
//  * q    - the queue
//  * req  - the http HEAD request for this url
//  * head - the http response
//  * next - callback
//
module.exports = pk.head(function(data, q, req, head, next) {

  // store content type for this URL
  data[req.url] = head.type;

  // if text/html, keep crawling
  if (head.type === "text/html") {
    q.xadd(req.url, require("./html"));
  }

  // done with this url
  next(data);
});
