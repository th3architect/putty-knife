putty-knife
===========

Gently scrape websites, sincerely, most definitely

API
===

_Queue_ **pk.scrape(** _str_ `entryUrl`**,** _function_ `queueHandler`**)**

The main putty knife function. It takes an entry url and adds it as the first
item to the queue.

* `entryUrl` &mdash; absolute url with protocol; usually something like http://example.com
* `queueHandler` &mdash; see `handler` parameter for `queue.enqueue`

A simple example using [superagent][superagent] and [cheerio][cheerio] is
provided in the `example` directory. After intalling the dev-dependencies, you
can run it using

```sh
$ node example/run.js
```

You should see output similar to `example/output.txt`

-----

_str_ **pk.resolveUrl(** _str_ `from`**,** _str_ `to` **)**

Resolves any relative or absolute path (`to`) to an absolute url (`from`). This
helps you enqueue a canonical URL to prevent your scraper from scraping the same
pages regardless of the varying relative links that point to the same resource.

Arguments

* `from` &mdash; usually the current url you're working with
* `to` &mdash; any relative or absolute path you scrape

Resolve relative paths

```js
pk.resolveUrl("http://example.com/a", "b/c.html");
// "http://example.com/a/b/c.html"

pk.resolveUrl("http://example.com/cat.png", "b/c.html");
// "http://example.com/b/c.html"

pk.resolveUrl("http://example.com/a/b/c", "../../d.html");
// "http://example.com/a/d.html"
```

Resolve absolute paths

```js
pk.resolveUrl("http://example.com/a", "/b.html");
// "http://example.com/b.html"
```

-----

_bool_ **pk.inDomain(** _str_ `currentUrl`**,** _str_ `newUrl` **)**

A helper function for checking if newly-discovered URLs are in "scope" of the
current working URL.

In domain

```js
pk.inDomain("http://example.com/a/b/c.html", "/cats.html");
// true

pk.inDomain("http://example.com/a/b/c.html", "http://example.com/hats.html");
// true
```

Not in domain (note `example.com` vs. `example.org` here)

```js
pk.inDomain("http://example.com/a/b/c.html", "http://example.org/dogs.html");
// false
```

-----

_void_ **queue.enqueue(** _str_ `url`**,** _function_ `handler` **)**

Adds another URL to scrape using the specified handler. You can setup multiple
handlers to process each URL however your heart desires

* `url` &mdash; the url to queue
* `handler` &mdash; receives 3 arguments
  * `q` &mdash; the Queue object handling this url
  * `url` &mdash; the current working url
  * `next` &mdash; call this when you're done processing the current url

Attribution
===========

* duchess <code@donut.club>

License
=======

BSD 3-Clause

[superagent]: https://github.com/visionmedia/superagent
[cheerio]: https://github.com/cheeriojs/cheerio
