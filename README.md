# LiveMusicLocal website

Astro and Tailwind marketing pages for LiveMusicLocal’s public beta.

- Website: https://livemusiclocal.com
- Separate beta app: https://app.livemusiclocal.com (not implemented in this repository)
- Pages: home, about, contact, sponsorship, privacy, and terms
- Contact, sponsorship, and beta update forms submit to Formspree. Delivery and mailing-list operations are configured outside this repository.

## Local development

Use Node.js **22.23.4 or newer** (or a supported newer LTS) and npm 9.6.5 or newer. From the repository root:

```sh
npm ci
npm run dev
```

Astro serves development pages at http://localhost:4321.

## Validation (no deployment)

```sh
npm run build
npm run check
npx playwright install chromium
npm test
npm run test:production
npm audit
```

Browser tests cover keyboard dialog behavior, mobile navigation, page metadata, privacy revision text, all six routes, desktop/mobile theme styling, image assets, sitemap, and 404 behavior. `npm test` starts Astro development; `npm run test:production` builds and starts **local-only** Wrangler static-asset serving on http://127.0.0.1:8787. Neither submits forms, tests the separate app, nor deploys.

`npm run check` runs Astro diagnostics and TypeScript without any deployment commands. Build output is generated in `dist/`. `npm run preview` uses Astro preview; `npm run serve:local` serves an existing build through local Wrangler.

## Content and configuration

- `src/pages/`: page content and page-specific descriptions
- `src/layouts/Layout.astro`: shared metadata, Google Fonts, and layout
- `src/components/`: header and footer
- `src/consts.ts`: default description and external app URL
- `public/images/`: optimized brand imagery used on the site and social previews
- `tailwind.config.mjs`: theme colors and fonts
- `astro.config.mjs`: canonical website origin and sitemap integration
- `postcss.config.mjs` and `src/styles/global.css`: Tailwind 3 and Autoprefixer pipeline
- `wrangler.json`: Cloudflare Workers static assets (no Worker script entrypoint)

There is no blog, RSS route, or content collection currently implemented. Google Fonts are requested remotely; website forms are processed by Formspree. Keep the privacy notice accurate when integrations change, and update its revision date only when the notice changes.

## Deployment and domains — manual, separately authorized

Do not run deployment commands while reviewing or testing a pull request.

For a separately approved production release, the existing commands are `npm run build` followed by `npm run deploy`. The latter runs `wrangler deploy` and requires authorized Cloudflare access. Domain bindings and any Cloudflare Git integration are managed outside this repository; no GitHub Actions workflows are included here. Verify external build/deploy settings before pushing branches if deployment must be avoided.

The configured canonical origin is `https://livemusiclocal.com`; the external app link is centralized in `src/consts.ts`. Changing either value does not provision DNS, bind a custom domain, or deploy the separate app. Do not change hosting or domain settings as part of routine page edits.

## Astro 7 / static-assets migration

This repository now uses Astro 7.4.7, sitemap 3.7.4, and Wrangler 4.158.0. Astro 7 brings Vite 8 and the Rust compiler. `compressHTML: true` explicitly preserves the previous inline whitespace behavior. Tailwind remains at 3.4.19 with its existing theme and classes, processed through PostCSS instead of the deprecated Astro integration; this is **not** a Tailwind 4 migration.

The old Cloudflare adapter, unused MDX/RSS packages, unused Tailwind 4 Vite plugin, generated Worker runtime types, and Worker-only asset ignore file have been removed. No current route uses SSR, sessions, server islands, APIs, MDX, or RSS. Adding those features later requires deliberately revisiting the dependencies and hosting configuration.

All six pages are generated as HTML. Following [Cloudflare’s static Astro guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/), Wrangler now uploads only `dist/`, without `main`, runtime bindings, Node compatibility, Worker observability settings, or source-map upload. The Worker name and canonical domain are unchanged; no DNS or live domain bindings are modified by these source changes. Source configuration cannot verify externally managed build settings.

**Release consequences:** a separately authorized release will replace the previous script-plus-assets artifact with an assets-only Worker. No runtime script or Worker logs/sessions should be expected. HTML requests use Cloudflare’s automatic trailing-slash handling and unmatched paths return 404 (not an app-shell fallback). Confirm external Cloudflare build infrastructure uses the Node version above and the existing build/deploy commands before releasing. No deployment is part of validation or this migration PR.

Security baseline and validation details are recorded in `SECURITY-MIGRATION.md`.
