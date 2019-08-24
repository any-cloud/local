import { pool } from "workerpool";

const { exec } = pool();

export const push = exec;
