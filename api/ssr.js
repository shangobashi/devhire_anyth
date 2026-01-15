import { createRequestListener } from "@react-router/node";
import * as build from "../build/server/main/index.js";

export default createRequestListener({
  build,
});