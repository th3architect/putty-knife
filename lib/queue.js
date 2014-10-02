function Queue(init, done) {

  var q       = this;
  var task    = init || {};
  var queue   = [];

  function enqueue(fn) {
    queue.push(fn);
  }

  function next(err) {
    //err?
    if (err) {
      return done(err, task);
    }

    // done?
    if (queue.length === 0) {
      return done(null, task);
    }

    // run task
    fn = queue.shift();
    fn.call(q, task, next);
  }

  Object.defineProperty(this, "length", {
    get: function() { return queue.length; }
  });

  this.enqueue   = enqueue;
  this.start     = next;
}

module.exports = Queue;
