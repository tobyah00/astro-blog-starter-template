# LiveMusicLocal website

Astro and Tailwind marketing pages for LiveMusicLocal’s public beta.

- Website: https://livemusiclocal.com
- Separate beta app: https://app.livemusiclocal.com (not implemented in this repository)
- Pages: home, about, contact, sponsorship, privacy, and terms
- Contact, sponsorship, and beta update forms submit to Formspree. Delivery and mailing-list operations are configured outside this repository.

## Local development

Use Node.js 22 LTS and npm. From the repository root:

```sh
npm ci
npm run dev
```

Astro serves development pages at http://localhost:4321.

## Validation (no deployment)

```sh
npm run build
npx tsc --noEmit
npx playwright install chromium
npm test
```

Browser tests start a local Astro server and cover keyboard dialog behavior, mobile navigation, page metadata, and privacy revision text. They do not submit forms or test the separate app.

The existing `npm run check` includes `wrangler deploy --dry-run`; use the commands above when no Wrangler deployment commands should run. Build output is generated in `dist/`.

## Content and configuration

- `src/pages/`: page content and page-specific descriptions
- `src/layouts/Layout.astro`: shared metadata, Google Fonts, and layout
- `src/components/`: header and footer
- `src/consts.ts`: default description and external app URL
- `public/images/`: optimized brand imagery used on the site and social previews
- `tailwind.config.mjs`: theme colors and fonts
- `astro.config.mjs`: canonical website origin and sitemap integration
- `wrangler.json`: Cloudflare Worker build entrypoint and static assets

There is no blog, RSS route, or content collection currently implemented. Google Fonts are requested remotely; website forms are processed by Formspree. Keep the privacy notice accurate when integrations change, and update its revision date only when the notice changes.

## Deployment and domains — manual, separately authorized

Do not run deployment commands while reviewing or testing a pull request.

For a separately approved production release, the existing commands are `npm run build` followed by `npm run deploy`. The latter runs `wrangler deploy` and requires authorized Cloudflare access. Domain bindings and any Cloudflare Git integration are managed outside this repository; no GitHub Actions workflows are included here. Verify external build/deploy settings before pushing branches if deployment must be avoided.

The configured canonical origin is `https://livemusiclocal.com`; the external app link is centralized in `src/consts.ts`. Changing either value does not provision DNS, bind a custom domain, or deploy the separate app. Do not change hosting or domain settings as part of routine page edits.
