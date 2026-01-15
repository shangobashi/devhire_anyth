const { createRequestListener } = require("@react-router/node");

const build = require("../build/server/main/index.cjs");

module.exports = createRequestListener({
  build,
});
