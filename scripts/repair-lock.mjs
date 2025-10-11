import { existsSync, rmSync, readFileSync } from "node:fs";
import { spawn } from "node:child_process";

function hasMergeMarkers(text) {
  return /<{7}|={7}|>{7}/.test(text);
}

function parseJSON(file) {
  try {
    const data = readFileSync(file, "utf8");
    JSON.parse(data);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, err: e };
  }
}

function log(msg) {
  console.log(`[repair-lock] ${msg}`);
}

async function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: "inherit", shell: false });
    p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });
}

(async () => {
  try {
    if (existsSync("package-lock.json")) {
      const raw = readFileSync("package-lock.json", "utf8");
      const conflict = hasMergeMarkers(raw);
      const parsed = parseJSON("package-lock.json");
      if (!parsed.ok || conflict) {
        log("package-lock.json is invalid or contains merge markers. Regenerating…");
        rmSync("package-lock.json", { force: true });
      } else {
        log("package-lock.json is valid. Proceeding to reinstall for consistency…");
      }
    } else {
      log("No package-lock.json present. Will create a fresh one.");
    }

    if (existsSync("node_modules")) {
      log("Removing node_modules…");
      rmSync("node_modules", { recursive: true, force: true });
    }

    log("Running npm install to recreate a clean lockfile…");
    await run("npm", ["install"]);

    log("Success. Clean lockfile generated.");
  } catch (err) {
    console.error("[repair-lock] FAILED:", err.message);
    process.exit(1);
  }
})();
