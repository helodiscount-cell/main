import { createConsola } from "consola";

export const clogger = createConsola({
  level: process.env.NODE_ENV === "production" ? 3 : 4,
  formatOptions: {
    compact: false, // expands objects instead of flattening them
    colors: true,
    date: true,
  },
});
