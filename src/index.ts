import Koa from "koa";
import cors from "@koa/cors";
import { bodyParser } from "@koa/bodyparser";
import router from "./router.js";

// set server listen port. Default is 1234
const DEFAULT_PORT: number = 1234;
const port = process.env.PORT || DEFAULT_PORT;

const app = new Koa();
app
  .use(cors())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  // start listening for incoming requests
  .listen(port, function () {
    console.log(`server listening on port ${port}`);
  });
