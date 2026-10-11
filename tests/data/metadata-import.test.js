import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { expect, it } from "vitest";

it("imports all PDF topic pages without merging optional particles or case-sensitive headwords", () => {
  const result = spawnSync(process.env.KET_PYTHON || "python3", ["-B", fileURLToPath(new URL("./metadata_import_test.py", import.meta.url))], { encoding: "utf8" });
  expect(result.error).toBeUndefined();
  expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
});
