import Redis from "ioredis";
const redis = new Redis();

const ENCAPSULATION_CHECK = "qpj32r4wefeklnfaroiefeh";

const unwrapKey = ({ key, encapsulation }) => {
  if (!key || key === "") {
    throw new Error("tried to use database with empty key");
  }
  if (!encapsulation || encapsulation !== ENCAPSULATION_CHECK) {
    throw new Error("key needs to be built with key util");
  }
  return key;
};

export const key = (...parts) => {
  parts.forEach(k => {
    if (!key || key === "") {
      throw new Error("tried to use database with empty key");
    }
  });
  const result = parts.join(":");
  return { key: result, encapsulation: ENCAPSULATION_CHECK };
};

export const set = (key, value) => {
  return redis.set(unwrapKey(key), JSON.stringify(value));
};

export const get = key => redis.get(unwrapKey(key)).then(JSON.parse);

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
