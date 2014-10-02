var pk   = require("../lib/putty-knife");
var url  = require("url");
var path = require("path");

// require subreddit cli arg
var subreddit = process.argv[2];
if (!subreddit) {
  console.error("Specify a subreddit like /r/nsfw");
  process.exit();
}

// imgur api token
var IMGUR = {
  CLIENT: {
    ID: "3e519d01f135d26",
    SECRET: "c01e941c2f142cd295cc8e87f4ad7e648f105857"
  }
};

// helpers
function addImages(scraper) {
  return function(task, next) {
    task.json.data.forEach(function(image) {
      scraper.add({url: image.link});
    });
    next();
  };
}

// json thread endpoint; adds next page images were found
function getNextPage(scraper) {
  return function(err, task, thread, next) {
    if (thread.json.data.length > 0) {
      task.page++;
      scraper.add(createGalleryTask(task), getNextPage(scraper));
    }
    next();
  }
}

// builds the imgur url to call
function createGalleryTask(task) {
  return {
    headers: task.headers,
    url: url.format({
      protocol: "https",
      host: "api.imgur.com",
      pathname: path.join("/3/gallery", task.gallery, "/time/all", String(task.page))
    })
  };
}

// -----------------------------------------------------------------------------
//
// params required for imgur api calls
var params = {
  headers: {
    "Authorization": ["Client-ID", IMGUR.CLIENT.ID].join(" ")
  },
  gallery: subreddit,
  page: 1
};

// main scraper instance
scraper = pk.scraper(params, function(err, task) {
  console.log("\nSCRAPER DONE:", task);
});

// application/json handler
scraper.use("application/json", pk.json, addImages(scraper));

// image/* handlers
var dir = path.resolve(__dirname, "./images");
scraper.use("image/jpeg", pk.binary, pk.writeToDisk(dir));
scraper.use("image/png",  pk.binary, pk.writeToDisk(dir));
scraper.use("image/gif",  pk.binary, pk.writeToDisk(dir));

// entry point
scraper.add(createGalleryTask(params), getNextPage(scraper));

// start the scraper
scraper.start();