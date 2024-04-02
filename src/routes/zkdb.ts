import type { ParameterizedContext } from "koa";
import * as request from "request";
import { ZKDatabaseStorage } from "zkdb";
import { Bool, CircuitString, PublicKey, Signature } from "o1js";

import {
  MVSContractV2,
  MVSMerkleWitnessV2,
  MVSProofGen,
  ProofRecord,
} from "../../contracts/src/index.js";

async function startZkDB() {
  let merkleHeight = 20;
  const zkDB = await ZKDatabaseStorage.getInstance("zkdb-mvs", {
    storageEngine: "local",
    merkleHeight,
    storageEngineCfg: {
      location: "./data",
    },
  });
  return zkDB;
}

async function checkStatus(userId: string) {
  let out = false;
  const options: request.Options = {
    method: "GET",
    url: "https://2ai922n5yg.execute-api.eu-north-1.amazonaws.com/mvs-api/mvs",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      usernames: userId,
      max_tweets: 5,
    }),
  };

  request.get(options, function (error: any, response: request.Response) {
    if (error) throw new Error(error);
    out = response.body;
  });

  return out;
}

async function getDatabaseRoot() {
  const zkDB = await startZkDB();
  const zkDBroot = await zkDB.getMerkleRoot();
  return zkDBroot;
}

async function generateProof(
  userId: string,
  userPubkey: string,
  userCount: bigint
) {
  const zkDB = await startZkDB();
  let userStatus = await checkStatus(userId);
  const userRecord = zkDB.findOne("userId", userId);
  if (!userRecord.isEmpty()) {
    throw new Error("userId present");
  }
  // get witness for user index
  const witness = new MVSMerkleWitnessV2(
    await zkDB.getWitnessByIndex(userCount)
  );
  const commitment = await getDatabaseRoot();
  await MVSProofGen.compile();
  const userProof = await MVSProofGen.getProof(
    witness,
    commitment,
    Bool(userStatus)
  );
  const proofJson = userProof.toJSON();
  const proofString = JSON.stringify(proofJson);
  const encoder = new TextEncoder();
  const bytes = encoder.encode(proofString);
  return bytes;
}

async function uploadProof(
  userId: string,
  userPubKey: string,
  signedProofBytes: Uint8Array
) {
  const zkDB = await startZkDB();
  const userRecord = zkDB.findOne("userId", userId);
  if (!userRecord.isEmpty()) {
    throw new Error("userId present");
  }
  const decoder = new TextDecoder();
  const signedProof = decoder.decode(signedProofBytes);
  const proofJson = JSON.parse(signedProof) as Signature;
  const signature = Signature.fromJSON(proofJson);
  const proofRecord = new ProofRecord({
    userId: CircuitString.fromString(userId),
    userPubKey: PublicKey.fromBase58(userPubKey),
    proof: signature.toFields(),
  });
  await zkDB.add(proofRecord);
  return true;
}

async function getUserProofRecord(userId: string) {
  const zkDB = await startZkDB();
  const userRecord = zkDB.findOne("userId", userId);
  if (userRecord.isEmpty()) {
    return null;
  }
  const userData = await userRecord.load(ProofRecord);
  const userWitness = new MVSMerkleWitnessV2(await userRecord.witness());
  const res = {
    userData,
    userWitness,
  };
  return res;
}

export async function getDBRootHandler(ctx: ParameterizedContext) {
  try {
    let res = await getDatabaseRoot();
    if (!res) {
      ctx.throw(400, "Ran into issues starting db server");
    }
    ctx.body = res;
  } catch (e) {
    ctx.throw(e as Error);
  }
}

export async function createProofHandler(ctx: ParameterizedContext) {
  try {
    let { userPubKey } = ctx.params;
    let { userId, count } = ctx.request.body;
    let proof = await generateProof(userId, userPubKey, count);
    ctx.status = 200;
    ctx.body = proof;
  } catch (e) {
    ctx.throw(e as Error);
  }
}

export async function uploadProofHandler(ctx: ParameterizedContext) {
  try {
    let { userPubKey } = ctx.params;
    let { userId, signedProofBytes } = ctx.request.body;
    let res = await uploadProof(userId, userPubKey, signedProofBytes);
    ctx.status = 200;
    ctx.body = res;
  } catch (e) {
    ctx.throw(e as Error);
  }
}

export async function getProofRecordHandler(ctx: ParameterizedContext) {
  try {
    let { userId } = ctx.request.body;
    let res = await getUserProofRecord(userId);
    if (!res) {
      ctx.throw(404, "User does not exist");
    }
    ctx.body = res;
  } catch (e) {
    ctx.throw(e as Error);
  }
}
