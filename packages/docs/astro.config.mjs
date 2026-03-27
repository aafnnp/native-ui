import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const docsRootDir = dirname(fileURLToPath(import.meta.url));
const docsKraUIRuntimeEntry = resolve(docsRootDir, "src/demos/kra-ui-runtime.ts");
const docsSvgShimEntry = resolve(docsRootDir, "src/shims/react-native-svg.tsx");
const docsReactNativeShimEntry = resolve(docsRootDir, "src/shims/react-native.ts");
const docsReactNativeInternalShimEntry = resolve(
  docsRootDir,
  "src/shims/react-native-internal.ts",
);

export default defineConfig({
  site: "https://kra-ui.dev",
  integrations: [mdx(), react()],
  vite: {
    resolve: {
      alias: [
        { find: "kra-ui", replacement: docsKraUIRuntimeEntry },
        { find: /^react-native$/, replacement: docsReactNativeShimEntry },
        { find: /^react-native\/Libraries\/.*/, replacement: docsReactNativeInternalShimEntry },
        { find: /^react-native-svg$/, replacement: docsSvgShimEntry },
        {
          find: /^react-native-reanimated(\/.*)?$/,
          replacement: "react-native-reanimated/mock",
        },
      ],
    },
  },
});
