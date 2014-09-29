var u       = require("url");
var p       = require("path");
var Queue   = require("./queue");
var request = require("superagent");
var cheerio = require("cheerio");

// bool inDomain(str domain, str url)
function inDomain(domain, url) {
  return u.parse(domain).hostname === u.parse(url).hostname;
}

// Queue scrape(mixed init, str url, function handler)
// * handler(mixed data, Queue q, str url, function next);
function scrape(init, url, handler) {
  var q = new Queue(init);
  q.add(url, handler);
  q.start();
  return q;
};

// function head(function handler)
// * handler(mixed data, Queue q, Request req, Response res, function next);
function head(handler) {
  return function _head(data, q, url, next) {
    console.error("HEAD %s", url);
    var req = request.head(url).end(function(res) {
      handler(data, q, req, res, next);
    });
  };
}

// function html(function handler)
// * handler(mixed data, Queue q, Request req, Response res, function next);
function html(handler) {
  return function _html(data, q, url, next) {
    console.error("GET %s", url);
    var req = request.get(url).end(function(res) {
      res.$ = cheerio.load(res.text);
      handler(data, q, req, res, next);
    });
  };
}

exports.inDomain        = inDomain;
exports.scrape          = scrape;
exports.head            = head;
exports.html            = html;
