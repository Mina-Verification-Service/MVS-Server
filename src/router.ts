import Router from "@koa/router";
import {
  getDBRootHandler,
  createProofHandler,
  uploadProofHandler,
  getProofRecordHandler,
} from "./routes/zkdb.js";

const router = new Router();
router.prefix("/zkdb");
router.get("/", (ctx) => {
  ctx.body = "Welcome to MVS zkDB";
});

// get db root
router.get("/getDBRoot", getDBRootHandler);

// create proof
// pass in the user social media id,
router.get("/createProof/:userPubKey", createProofHandler);

// store proof signature
// pass in the user social media id, and signed proof
router.post("/uploadProof/:userPubKey", uploadProofHandler);

// returns user proof signature record
router.get("/getProofRecord/:userPubKey", getProofRecordHandler);

export default router;
