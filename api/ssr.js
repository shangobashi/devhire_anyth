const { createRequestListener } = require("@react-router/node");

const build = require("../build/server/main/index.js");

module.exports = createRequestListener({
  build,
});