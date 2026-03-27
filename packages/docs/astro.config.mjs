import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const docsRootDir = dirname(fileURLToPath(import.meta.url));
const uiEntryPath = resolve(docsRootDir, "../ui/src/index.ts");

export default defineConfig({
  site: "https://kra-ui.dev",
  integrations: [mdx(), react()],
  vite: {
    resolve: {
      alias: {
        "kra-ui": uiEntryPath,
      },
    },
  },
});
