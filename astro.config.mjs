import { defineConfig } from "astro/config";
export default defineConfig({
  site: "https://muhammadyusufprananda.github.io",
  base: "/aku-oregairu",
  output: "static",
  devToolbar: { enabled: false },
  trailingSlash: "always",
});
