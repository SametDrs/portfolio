import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  i18n: {
    defaultLocale: "tr",
    locales: ["tr", "en"],
    routing: { prefixDefaultLocale: false },
  },
});
