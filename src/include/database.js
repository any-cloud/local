import { database as common } from "@any-cloud/core";
import Redis from "ioredis";
const redis = new Redis();

export const keySep = ":";

export const set = async (key, value) => {
  return (
    (await redis.set(common.unwrapKey(key), JSON.stringify(value))) === "OK"
  );
};

export const get = async (aKey, opts = {}) => {
  const result = await redis.get(common.unwrapKey(aKey));
  if (!result) {
    if (opts.silent) return;
    const keyString = common.unwrapKey(aKey);
    const namespace = keyString.split(keySep);
    let lastKeyPart = namespace.pop();
    const didYouMean = await keySearch(`*${lastKeyPart}`);
    if (didYouMean && didYouMean.length > 0) {
      console.error(
        `key not found: '${keyString}', did you mean: ${didYouMean}`
      );
    } else {
      console.error(`key not found '${common.unwrapKey(aKey)}'`);
    }
    console.trace();
  } else {
    return JSON.parse(result);
  }
};

export const getAllKeys = async partialKey => {
  var stream = redis.scanStream({ match: `${common.unwrapKey(partialKey)}*` });
  return new Promise((resolve, reject) => {
    const result = [];

    stream.on("data", resultKeys => {
      for (var i = 0; i < resultKeys.length; i++) {
        result.push(common.key(resultKeys[i]));
      }
    });
    stream.on("end", () => resolve(result));
    stream.on("error", error => reject(error));
  });
};

export const getAll = async partialKey => {
  var stream = redis.scanStream({ match: `${common.unwrapKey(partialKey)}*` });
  return new Promise((resolve, reject) => {
    const result = [];

    stream.on("data", resultKeys => {
      for (var i = 0; i < resultKeys.length; i++) {
        result.push(get(common.key(resultKeys[i])));
      }
    });
    stream.on("end", () => resolve(Promise.all(result)));
    stream.on("error", error => reject(error));
  });
};

export const remove = async key => {
  return (await redis.del(common.unwrapKey(key))) > 0;
};

export const reset = async ({ force }) => {
  if (force) {
    await redis.flushall();
    return true;
  } else {
    console.warn("refusing to reset database, force was not set");
    return false;
  }
};

export const keySearch = keyPattern => {
  var stream = redis.scanStream({ match: keyPattern });
  return new Promise((resolve, reject) => {
    const result = [];

    stream.on("data", resultKeys => {
      for (var i = 0; i < resultKeys.length; i++) {
        result.push(resultKeys[i]);
      }
    });
    stream.on("end", () => resolve(Promise.all(result)));
    stream.on("error", error => reject(error));
  });
};
