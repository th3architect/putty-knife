function Cache() {
  var cache = [];

  function add(item) {
    cache.push(item);
  }

  function isCached(item) {
    return cache.indexOf(item) !== -1;
  }

  this.add = add;
  this.isCached = isCached;
}

module.exports = Cache;
