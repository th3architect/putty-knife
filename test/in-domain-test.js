var assert  = require("chai").assert;
var pk      = require("../");

describe("inDomain", function() {

  it("same hostname should be in domain", function() {
    var domain = "http://foo.test";
    var url    = "http://foo.test/a/b";
    assert.isTrue(pk.inDomain(domain, url));
  });

  it("same hostname with subdomain should be in domain", function() {
    var domain = "http://a.b.foo.test";
    var url    = "http://a.b.foo.test/c/d";
    assert.isTrue(pk.inDomain(domain, url));
  });

  it("different hostname should be out of domain", function() {
    var domain = "http://foo.test";
    var url    = "http://bar.test/c/d";
    assert.isFalse(pk.inDomain(domain, url));
  });

});
