export const state = {};

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
  state[unwrapKey(key)] = value;
};

export const get = key => state[unwrapKey(key)];

export const getAll = partialKey =>
  Object.keys(state)
    .filter(key => key.indexOf(unwrapKey(partialKey)) === 0 && state[key] !== null)
    .map(key => state[key]);

export const remove = key => state[key] = null;

export const reset = ({ force }) => {
  if (force) {
    Object.keys(state).forEach(key => remove(key));
  } else {
    console.warn("refusing to reset database, force was not set");
  }
};
