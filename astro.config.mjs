// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://livemusiclocal.com",
  output: "static",
  // Retain pre-v7 HTML whitespace behavior around inline links.
  compressHTML: true,
  integrations: [sitemap()],
});
