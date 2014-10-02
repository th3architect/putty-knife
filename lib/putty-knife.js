var fs      = require("fs");
var path    = require("path");
var Scraper = require("./scraper");
var Queue   = require("./queue");

var request = require("superagent");
// current bug in superagent
delete request.parse["application/json"];

var cheerio = require("cheerio");
var u       = require("url");

function inDomain(domain, url) {
  return u.parse(domain).hostname === u.parse(url).hostname;
}

function scraper(init, callback) {
  return new Scraper(init, callback);
}

// requires task.url
// sets task.req
// sets task.head
// sets task.type
function head(task, next) {

  function done(err, res) {
    task.head = res;
    task.type = res.type;
    next(err, task);
  }

  console.error("\nHEAD %s", task.url);
  task.req = request.head(task.url).set(task.headers || {}).end(done);
}

// requires task.url
// requires task.head
// requires task.type
// sets task.req
// sets task.html
// sets task.$
function html(task, next) {

  function done(err, res) {
    task.html = res;
    task.$    = cheerio.load(res.text);
    next(err, task);
  }

  console.error("GET %s", task.url);
  task.req = request.get(task.url).set(task.headers || {}).end(done);
}

// requires task.url
// requires task.head
// requires task.type
// sets task.req
// sets task.json
function json(task, next) {

  function done(err, res) {
    try {
      task.json = JSON.parse(res.text);
      next(err, task);
    }
    catch (jsonErr) {
      next(jsonErr, task);
    }
  }

  console.error("GET [%s] %s", task.type, task.url);
  task.req = request.get(task.url).set(task.headers || {}).end(done);
};

// requires task.url
// requires task.head
// requires task.type
// sets task.req
function binary(task, next) {
  var q = this;
  console.error("GET [%s] %s", task.type, task.url);
  task.req = request.get(task.url);
  next(null, task);
}

// requires task.url
// requires task.req
// sets task.stream
function writeToDisk(dir) {
  return function(task, next) {
    var dest = path.join(dir, path.basename(task.url));
    task.stream = fs.createWriteStream(dest);
    task.req.pipe(task.stream);
    next();
  };
}

function thread(types, init, done) {
  return function(qTask, next) {

    var thread = new Queue(init, function(err, task) {
      if (done instanceof Function) {
        return done(err, qTask, task, next);
      }
      next();
    });

    thread.enqueue(head);

    thread.enqueue(function(task, next) {
      (types[task.type] || []).forEach(function(h) {
        thread.enqueue(h);
      });

      // no handler
      if (!(task.type in types)) {
        console.error("SKIPPING %s BECAUSE %s", task.url, task.type);
        console.log(types);
      }

      // next
      next();
    });

    thread.start();
  };
}



exports.inDomain = inDomain;
exports.scraper = scraper;
exports.binary = binary;
exports.head = head;
exports.html = html;
exports.json = json;
exports.thread = thread;
exports.writeToDisk = writeToDisk;
