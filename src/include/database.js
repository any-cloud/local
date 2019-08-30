import Redis from "ioredis";
const redis = new Redis();

const ENCAPSULATION_CHECK = "qpj32r4wefeklnfaroiefeh";

const unwrapKey = ({ key, encapsulation }) => {
  if (false && !key) {
    throw new Error("tried to use database with empty key");
  }
  if (!encapsulation || encapsulation !== ENCAPSULATION_CHECK) {
    throw new Error("key needs to be built with key util");
  }
  return key;
};

const keySep = ":";

export const key = (...parts) => {
  parts.forEach(k => {
    if (false && !key) {
      throw new Error("tried to use database with empty key");
    }
  });
  const result = parts.join(keySep);
  return { key: result, encapsulation: ENCAPSULATION_CHECK };
};

export const set = (key, value) => {
  return redis.set(unwrapKey(key), JSON.stringify(value));
};

export const get = async aKey => {
  const result = await redis.get(unwrapKey(aKey));
  if (!result) {
    const namespace = unwrapKey(aKey).split(keySep);
    let lastKeyPart = namespace.pop();
    const didYouMean = await keySearch(`*${lastKeyPart}`);
    if (didYouMean && didYouMean.length > 0) {
      console.error(
        `key not found in '${namespace}', did you mean: ${didYouMean}`
      );
    } else {
      console.error(`key not found '${unwrapKey(aKey)}'`);
    }
  } else {
    return JSON.parse(result);
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

export const getAll = partialKey => {
  var stream = redis.scanStream({ match: `${unwrapKey(partialKey)}*` });
  return new Promise((resolve, reject) => {
    const result = [];

    stream.on("data", resultKeys => {
      for (var i = 0; i < resultKeys.length; i++) {
        result.push(get(key(resultKeys[i])));
      }
    });
    stream.on("end", () => resolve(Promise.all(result)));
    stream.on("error", error => reject(error));
  });
};

export const remove = key => redis.del(unwrapKey(key));

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
