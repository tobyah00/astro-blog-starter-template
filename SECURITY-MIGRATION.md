# Security and static-hosting migration

Reviewed November 8, 2026. Baseline: merged main `fee7052` (PR #11).

## Audit evidence

`npm audit --json` reported the following vulnerable **package** counts (not the number of individual advisory records):

| Severity | Before | After |
| --- | ---: | ---: |
| Critical | 2 | 0 |
| High | 23 | 0 |
| Moderate | 4 | 0 |
| Low | 1 | 0 |
| Total | 30 | 0 |

The after result includes development dependencies; no omit flags, advisory suppression, overrides, or forced audit fix were used. Registry/advisory information can change, so rerun `npm ci && npm audit` rather than treating this report as a permanent guarantee.

### Critical packages and exposure

- **Astro 5.10.1:** multiple advisory records, including [AVIF image optimization RCE](https://github.com/advisories/GHSA-26w7-cxv4-gfx2) (fixed in 7.2.8) and [JSX/MDX script/style content escaping](https://github.com/advisories/GHSA-98hj-9722-w3j8) (fixed in 7.3.2). Updating only to the audit-suggested Astro 5.18.2 would leave newer advisories unresolved. This migration uses maintained Astro **7.4.7**. Current pages do not accept uploaded images or render untrusted MDX, but this does not make an affected framework version patched.
- **fast-xml-parser**, pulled in by unused `@astrojs/rss`: XML entity expansion, injection, and denial-of-service issues, including [GHSA-8gc5-j5rx-235r](https://github.com/advisories/GHSA-8gc5-j5rx-235r) and [GHSA-gh4j-gqv2-49f6](https://github.com/advisories/GHSA-gh4j-gqv2-49f6). There is no RSS route or XML-processing feature here. Removing unused RSS removes that dependency path instead of preserving unused functionality.

### Other affected dependency paths

- Removed unnecessary Cloudflare adapter: image endpoint SSRF ([GHSA-88gm-j2wx-58h6](https://github.com/advisories/GHSA-88gm-j2wx-58h6)); no runtime image endpoint remains in this static output.
- Updated Wrangler **4.21.2 → 4.158.0** and its local tooling dependencies (Miniflare, Undici, busboy, ws, Sharp). Wrangler's old command-injection advisory concerned deployment tooling, not a demonstrated exploit of this site's HTML.
- Updated sitemap **3.4.1 → 3.7.4** and associated schema dependencies.
- Astro 7 updates the Vite/build dependency tree and vulnerable serialization/parser paths. Development-server vulnerabilities matter for developers even when production serves only HTML.
- Removed unused MDX and Tailwind 4 Vite integrations. Preserved Tailwind **3.4.19**, replacing the deprecated Astro integration with PostCSS **8.5.32** and Autoprefixer **10.6.2**.
- Targeted compatible transitive refreshes patched `mdast-util-to-hast`, `picomatch`, and `postcss-selector-parser`; refreshed Browserslist/caniuse data. No major transitive overrides were imposed.

No advisory remains in the final audit. This is not proof that the site has no vulnerabilities, nor an audit of Formspree, Google Fonts, Cloudflare account settings, or the separate app.

## Hosting consequences

This is an approved **repository configuration migration**, not a live deployment. `wrangler.json` retains the Worker name and compatibility date; `astro.config.mjs` retains the canonical origin. Domain bindings and DNS are untouched.

The future release artifact changes from script-plus-assets to assets-only. Removed `main`, ASSETS runtime binding, Node runtime flag, Worker observability/source-map settings, adapter runtime declarations, and generated Worker types. No current route requires them. All six pages are prerendered; there is no SSR/session/API behavior to preserve. Future dynamic routes require explicitly restoring an appropriate adapter/runtime configuration.

Local Wrangler validates assets-only route serving, automatic HTML trailing-slash behavior, real missing-route 404 responses, images, CSS, and sitemap. It does not validate live domain bindings or an external Cloudflare Git build pipeline. A future release requires Node **22.23.4+** (tested here with **24.22.1**) and separate authorization.

References: [Astro v7 migration](https://docs.astro.build/en/guides/upgrade-to/v7/), [Astro v6 migration](https://docs.astro.build/en/guides/upgrade-to/v6/), [Cloudflare static Astro guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/).

## Reproducible validation

- `npm ci`
- `npm audit` (full dependency tree)
- `npm run build` (six static pages; no prior Cloudflare/Sharp/Browserslist build warnings)
- `npm run check` (Astro diagnostics plus TypeScript, no deploy/dry-run command)
- `npm test` (six Chromium tests against Astro development)
- `npm run test:production` (same six tests against local-only Wrangler production assets)
- `git diff --check`

Tests cover the existing four dialog/navigation/metadata/privacy regressions and added desktop/mobile styling/images across all six routes, sitemap and missing-route behavior. Forms are never submitted. No app work, deployment, merge, live Cloudflare changes, or domain changes are part of this PR.
