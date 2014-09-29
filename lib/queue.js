var EventEmitter = require("events").EventEmitter;

// Queue Queue(mixed init)
function Queue(init) {

  EventEmitter.call(this);

  var cache  = [];
  var queue  = [];
  var q      = this;

  // void ifAdd(bool predicate, str url, function handler)
  function ifAdd(predicate, url, handler) {
    if (predicate) add(url, handler);
  }

  // void add(str url, function handler)
  function add(url, handler) {
    queue.push({url: url, handler: handler});
  }

  // void xadd(str url, function handler)
  function xadd(url, handler) {
    ifAdd(!isCached(url), url, handler);
    cache.push(url);
  }

  // void next()
  function next(prev) {
    if (queue.length === 0) return q.emit("end", prev);
    task = queue.shift();
    task.handler((prev === undefined ? init : prev), q, task.url, next);
  }

  // bool isCached(str url)
  function isCached(url) {
    return cache.indexOf(url) !== -1;
  }

  // int length
  Object.defineProperty(this, "length", {
    get: function() { return queue.length; }
  });

  // this.enqueue  = enqueue;
  this.add      = add;
  this.xadd     = xadd;
  this.ifAdd    = ifAdd;
  this.isCached = isCached;
  this.start    = next;
}

Queue.prototype = Object.create(EventEmitter.prototype, {
  constructor: {
    value: Queue
  }
});

module.exports = Queue;
