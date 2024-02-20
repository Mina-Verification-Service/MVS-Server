import Router from "@koa/router";
import { addUserHandler, getUserHandler, getDBRootHandler } from "./routes/zkdb.js";

const router = new Router();
router.prefix("/zkdb");
router.get("/", (ctx) => {
  ctx.body = "Welcome to MVS zkDB";
});
router.get("/getUser/:userPubKey", getUserHandler);
router.get("/getDBRoot", getDBRootHandler);
router.post("/addUser/:userPubKey", addUserHandler);

export default router;
