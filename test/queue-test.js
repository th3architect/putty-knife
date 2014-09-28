var assert  = require("chai").assert;
var Queue   = require("../lib/queue");

describe("Queue", function() {

  it(".enqueue increases queue length", function() {
    var q = new Queue();
    q.enqueue("a");
    q.enqueue("b");
    assert.strictEqual(q.length, 2);
  });

  it(".enqueue caches a url", function() {
    var q = new Queue();
    q.enqueue("foo");
    assert.isTrue(q.isCached("foo"));
  });

  it(".enqueue does not requeue a cached url", function() {
    var q = new Queue();
    q.enqueue("foo");
    q.enqueue("foo");
    assert.strictEqual(q.length, 1);
  });

  it("emits end event when done", function(done) {
    var q = new Queue();
    q.on("end", function() { done(); });
    q.start();
  });

  it(".start runs the queue", function(done) {
    var actual = [];
    var expected = ["foo", "bar"];
    var q = new Queue();

    function handler(q, url, done) {
      actual.push(url);
      done();
    }

    q.enqueue("foo", handler);
    q.enqueue("bar", handler);

    q.on("end", function() {
      assert.deepEqual(actual, expected);
      done();
    });

    q.start();
  });

});
