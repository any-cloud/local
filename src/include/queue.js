import { pool } from "workerpool";

const { exec } = pool();

export const push = exec;

export const register = (fn) => {
  // TODO: enforce registration
}
