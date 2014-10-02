var pk    = require("./putty-knife");
var Queue = require("./queue");
var Cache = require("./cache");

function Scraper(init, done) {
  Queue.call(this, init, done);

  var q = this;
  var types = {};
  var cache = new Cache();

  function use(type) {
    var handlers = [].slice.call(arguments, 1)
    types[type] = handlers;
  }

  function add(task, done) {
    if (cache.isCached(task.url)) {
      console.error("CACHED:", task.url);
      return;
    }
    cache.add(task.url);
    q.enqueue(pk.thread(types, task, done));
  }

  this.use = use;
  this.add = add;
}

module.exports = Scraper;
