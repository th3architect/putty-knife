var assert  = require("chai").assert;
var pk      = require("../");

describe("resolveUrl", function() {

  it("should resolve absolute urls", function() {
    var expected = "http://example.com/a/b/c.ext";
    var actual   = pk.resolveUrl("http://foo.com", "http://example.com/a/b/c.ext");
    assert.strictEqual(actual, expected);
  });

  it("should resolve simple relative urls", function() {

    var cases = [
      {root: "http://a.test",     path: "a.ext",  expected: "http://a.test/a.ext"},
      {root: "http://a.test/",    path: "a.ext",  expected: "http://a.test/a.ext"},
      {root: "http://a.test/a",   path: "b.ext",  expected: "http://a.test/a/b.ext"},
      {root: "http://a.test/a/",  path: "b.ext",  expected: "http://a.test/a/b.ext"}
    ];

    cases.forEach(function(c) {
      var actual = pk.resolveUrl(c.root, c.path);
      assert.strictEqual(actual, c.expected);
    });
  });

  it("should resolve double-dot relative urls", function() {

    var cases = [
      {root: "http://a.test",     path: "../a.ext",   expected: "http://a.test/a.ext"},
      {root: "http://a.test/",    path: "../a.ext",   expected: "http://a.test/a.ext"},
      {root: "http://a.test/a",   path: "../b.ext",   expected: "http://a.test/b.ext"},
      {root: "http://a.test/a/",  path: "../b.ext",   expected: "http://a.test/b.ext"},
      {root: "http://a.test/a/b", path: "../c/d.ext", expected: "http://a.test/a/c/d.ext"}
    ];

    cases.forEach(function(c) {
      var actual = pk.resolveUrl(c.root, c.path);
      assert.strictEqual(actual, c.expected);
    });
  });

  it("should resolve leading-slash relative urls", function() {

    var cases = [
      {root: "http://a.test",     path: "/a.ext", expected: "http://a.test/a.ext"},
      {root: "http://a.test/",    path: "/a.ext", expected: "http://a.test/a.ext"},
      {root: "http://a.test/a",   path: "/b.ext", expected: "http://a.test/b.ext"},
      {root: "http://a.test/a/b", path: "/c.ext", expected: "http://a.test/c.ext"},
    ];

    cases.forEach(function(c) {
      var actual = pk.resolveUrl(c.root, c.path);
      assert.strictEqual(actual, c.expected);
    });
  });

  it("should treat urls without an extension as directories", function() {
    var cases = [
      {root: "http://a.test",       path: "a.ext", expected: "http://a.test/a.ext"},
      {root: "http://a.test/a",     path: "b.ext", expected: "http://a.test/a/b.ext"},
      {root: "http://a.test/a.ext", path: "b.ext", expected: "http://a.test/b.ext"},
    ];

    cases.forEach(function(c) {
      var actual = pk.resolveUrl(c.root, c.path);
      assert.strictEqual(actual, c.expected);
    });
  });

});
