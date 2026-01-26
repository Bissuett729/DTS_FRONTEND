const fs = require("fs");
const path = require("path");

// Puedes usar la variable de GitLab CI/CD $CI_COMMIT_TAG o $CI_COMMIT_SHA
const version = process.env.CI_COMMIT_TAG || process.env.CI_COMMIT_SHA || "dev";
const buildDate = new Date().toISOString();

const versionFile = path.join(__dirname, "../src/assets/version.json");

fs.writeFileSync(versionFile, JSON.stringify({ version, buildDate }, null, 2));

console.log("Version file generated:", versionFile, version);
