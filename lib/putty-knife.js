var u       = require("url");
var p       = require("path");
var Queue   = require("./queue");

function inDomain(domain, url) {
  return u.parse(domain).hostname === u.parse(url).hostname;
}

function isFilename(pathname) {
  return p.extname(pathname) !== "";
}

function resolveUrl(root, path) {
  var rootObj = u.parse(root);
  // pretty urls get trailing slashes for proper resolution
  if (!isFilename(rootObj.pathname)) {
    rootObj.pathname = p.join(rootObj.pathname, "/");
  }
  return u.resolve(u.format(rootObj), path);
}

function scrape(url, handler) {
  var q = new Queue();
  q.enqueue(url, handler);
  q.start();
  return q;
};

exports.inDomain        = inDomain;
exports.resolveUrl      = resolveUrl;
exports.scrape          = scrape;
