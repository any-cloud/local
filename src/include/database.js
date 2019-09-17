import { database as common } from "@any-cloud/core";
import Redis from "ioredis";
const redis = new Redis();

export const keySep = ":";

export const set = (key, value) => {
  return redis.set(common.unwrapKey(key), JSON.stringify(value));
};

export const get = async aKey => {
  const result = await redis.get(common.unwrapKey(aKey));
  if (!result) {
    const namespace = common.unwrapKey(aKey).split(keySep);
    let lastKeyPart = namespace.pop();
    const didYouMean = await keySearch(`*${lastKeyPart}`);
    if (didYouMean && didYouMean.length > 0) {
      console.error(
        `key not found in '${namespace}', did you mean: ${didYouMean}`
      );
    } else {
      console.error(`key not found '${common.unwrapKey(aKey)}'`);
    }
  } else {
    return JSON.parse(result);
  }
};

export const getAll = partialKey => {
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

export const remove = key => redis.del(common.unwrapKey(key));

export const reset = ({ force }) => {
  if (force) {
    var stream = redis.scanStream({ match: "*" });
    return new Promise((resolve, reject) => {
      const result = [];

      stream.on("data", resultKeys => {
        for (var i = 0; i < resultKeys.length; i++) {
          result.push(redis.del(resultKeys[i]));
        }
      });
      stream.on("end", () => resolve(Promise.all(result)));
      stream.on("error", error => reject(error));
    });
  } else {
    console.warn("refusing to reset database, force was not set");
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
