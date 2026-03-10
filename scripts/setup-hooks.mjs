import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const repoRoot = process.cwd();
const gitDirectory = path.join(repoRoot, ".git");

if (!existsSync(gitDirectory)) {
  process.exit(0);
}

try {
  execFileSync("git", ["config", "core.hooksPath", ".githooks"], {
    cwd: repoRoot,
    stdio: "ignore"
  });
} catch {
  process.exit(0);
}
