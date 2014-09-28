var assert  = require("chai").assert;
var pk      = require("../lib/putty-knife");
var Queue   = require("../lib/queue");

describe("scrape", function() {

  it("returns a Queue object", function() {
    var q = pk.scrape("cat", function() {});
    assert.instanceOf(q, Queue);
  });

  it("calls handler with queue, url, next", function(done) {
    var urls = ["cat", "hat", "wat"];
    var expected = ["cat", "hat", "wat"];
    var actual = [];
    var nextUrl;

    var q = pk.scrape(urls.shift(), function scrape(err, q, url, next) {
      if (nextUrl = urls.shift()) {
        q.enqueue(nextUrl, scrape);
      }
      actual.push(url);
      process.nextTick(next);
    });

    q.on("end", function() {
      assert.deepEqual(actual, expected);
      done();
    });
  });

});
