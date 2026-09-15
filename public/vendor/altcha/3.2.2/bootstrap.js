import "./altcha.min.js";
import "./da.js";
globalThis.$altcha.algorithms.set("PBKDF2/SHA-256", () => new Worker(new URL("./pbkdf2.js", import.meta.url)));
