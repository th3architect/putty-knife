var EventEmitter = require("events").EventEmitter;

function Queue() {

  EventEmitter.call(this);

  var cache  = [];
  var queue  = [];
  var q      = this;

  function enqueue(url, handler) {
    if (isCached(url)) return;
    cache.push(url);
    queue.push({url: url, handler: handler});
  }

  function next(err) {
    if (err) throw err;
    if (queue.length === 0) return q.emit("end");
    task = queue.shift();
    task.handler(q, task.url, next);
  }

  function isCached(url) {
    return cache.indexOf(url) !== -1;
  }

  Object.defineProperty(this, "length", {
    get: function() { return queue.length; }
  });

  this.enqueue  = enqueue;
  this.isCached = isCached;
  this.start    = next;
}

Queue.prototype = Object.create(EventEmitter.prototype, {
  constructor: {
    value: Queue
  }
});

module.exports = Queue;
