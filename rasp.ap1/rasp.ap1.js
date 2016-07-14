var request = require('request');

var loadPage = function (uri, options) {
  return request.get(uri, { timeout: options.time })
};

module.exports = {
  loadPage: loadPage
};
