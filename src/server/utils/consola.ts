import { createConsola } from "consola";

export const clogger = createConsola({
  level: process.env.NODE_ENV === "production" ? 3 : 4,
});
