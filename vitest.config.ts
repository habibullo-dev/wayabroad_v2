import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Mirror the "@/*" -> repo-root alias from tsconfig.json (no plugin needed).
    alias: [
      {
        find: /^@\//,
        replacement: fileURLToPath(new URL("./", import.meta.url)),
      },
    ],
  },
  test: {
    environment: "node",
    include: ["**/*.{test,spec}.ts"],
    exclude: ["node_modules", ".next", "dist", "build"],
  },
});
