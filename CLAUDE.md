# CLAUDE.md

This is the portfolio site for Nathanael Cammay, a software developer based in Johannesburg. He has 4+ years of experience on enterprise insurance systems at Hollard Insurance. He works mainly in C#/.NET, SQL Server, JavaScript and React, and also on system integrations and REST APIs. Never describe him as "junior". The site is for clients, recruiters and hiring managers, and covers software development only.

## Working with Nathanael

- Claude writes the code. Nathanael reviews every change in a pull request.
- **Explain infrastructure in depth, and code only briefly.** Infrastructure means hosting, builds, CI/CD, GitHub Pages, domains, DNS, HTTPS and email. For each of these, explain in plain language:
  - what it is
  - why we need it
  - what would break without it

  Assume he hasn't come across the concept before. For ordinary site code, one line on what changed and why is enough.
- Each time an infrastructure step is finished, add or update its section in `docs/hosting.md`. That way the explanations outlive the chat, and he can walk an interviewer through how the site is built and deployed.
- Some steps happen outside the repo, such as GitHub settings, the domain registrar, DNS records and `gh auth login`. For these, give the exact clicks and values to enter, and tell him what he should see when it has worked.
- Don't invent experience, metrics, clients or projects. Bio and experience come from his latest CV, titled "Software Developer". Ask him for anything the CV doesn't cover.

## Git workflow

- Never commit to `main`. Put each piece of work on its own branch (`feat/…`, `fix/…`, `chore/…`, `docs/…`) and open a PR with `gh pr create`. Nathanael reviews and merges.
- Each PR description should cover what changed, why, and how to check it. If an infrastructure PR needs him to do something outside the repo, list those steps too.
- Merging to `main` deploys the site, so `main` must always build.

## Stack

- Astro + React, with TypeScript. Nathanael chose React, so write UI components in React (`src/components/*.tsx`). Use `.astro` files for pages (`src/pages/`) and layouts.
- React components render to static HTML at build time. Only add a `client:*` directive when a component genuinely needs to run in the browser, such as the theme toggle.
- The theme must be set by a small inline script in `<head>`, not by React. A React island runs too late to stop the page flashing the wrong theme.
- Style with plain CSS and custom properties, with no CSS framework.
- Output is static only: no server and no database.
- Node 24 with npm.

### Commands

- `npm run dev`: dev server at `localhost:4321/`. When Claude starts it, use `npx astro dev --background`. Manage it with `npx astro dev stop`, `status` and `logs`.
- `npm run build`: builds the site into `dist/`. Run this before opening a PR.
- `npm run preview`: serves the built `dist/` locally.
- `npm run images`: regenerates `favicon.ico`, `apple-touch-icon.png` and `og-image.png` in `public/` from `public/favicon.svg` and the template in `scripts/generate-images.mjs`. Run it locally on Windows and commit the output.

### SEO and previews

- `BaseLayout.astro` sets the title, description, canonical URL, Open Graph and Twitter tags for every page. Pass `title` and `description` from each page. Pass `type="article"` for project pages, and `noindex` for pages that shouldn't be in search results.
- The home page passes schema.org `Person` JSON-LD through the `jsonLd` prop. Keep it in step with `src/data/profile.ts`.
- The sitemap comes from `@astrojs/sitemap`. `public/robots.txt` points to it.
- Keep Lighthouse at 100 in all four categories. Interactive islands should use `client:idle` unless they have to work instantly.

### Astro docs

Check the relevant guide before working on these areas:
- [Routing](https://docs.astro.build/en/guides/routing/)
- [Framework components (React)](https://docs.astro.build/en/guides/framework-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling](https://docs.astro.build/en/guides/styling/)

## Hosting

- The site is hosted on GitHub Pages. The workflow `.github/workflows/deploy.yml` builds every PR as a check, and builds and deploys every push to `main`. `docs/hosting.md` explains it.
- The repo is `NathanaelCammay/portfolio` and is public.
- The site lives at `https://nathanaelcammay.com`, served from the root with no `base`.
  - `nathanaelcammay.github.io/portfolio/` redirects there automatically.
  - Still build internal links and asset paths with `url()` from `src/lib/url.ts`, so a base path could be reintroduced without touching every link.
- The domain is registered with Cloudflare, which also runs its DNS. Records:
  - 4 A and 4 AAAA records on `@`, pointing at GitHub Pages' addresses
  - a CNAME from `www` to `nathanaelcammay.github.io`
  - a `_github-pages-challenge-…` TXT record that verifies the domain with GitHub
- All records are "DNS only", never proxied. Proxying would break GitHub's HTTPS certificate.
- The custom domain is set in the repo's Settings → Pages, not with a `CNAME` file. A `CNAME` file isn't used with Actions-based deploys.

## Site

- Pages:
  - Home
  - Projects: a list, plus one page per project
  - About: bio, experience and CV download
  - Contact: email, LinkedIn and GitHub links
- Personal details, experience and skills live in `src/data/profile.ts`. Edit them there, not in the pages.
- Never publish his phone number, on any page or in the downloadable CV.
- The CV download is `public/Nathanael-Cammay-CV.pdf`, a copy without the phone number that he supplies. The About page only shows the download button when that file exists.
- There is no blog or writing section.
- Projects are Markdown files in `src/content/projects/`. The file name becomes the URL slug.
  - The frontmatter schema is in `src/content.config.ts`: `title`, `summary`, `stack`, `date`, optional `repo` and `live`, and `draft`.
  - The body uses these sections: `## The problem`, `## The approach`, `## What I decided and why`.
  - Set `draft: true` to hide a project that isn't finished.
- The portfolio itself is the first project. The Projects page has to look good with just one.
- Pages are built as `name.html` (`build.format: 'file'`), not `name/index.html`, so GitHub Pages serves them without a redirect. Link to pages without a trailing slash.
- Design should be simple and polished.
  - Dark mode is the default, with a toggle to switch to light mode.
  - Remember the visitor's choice in `localStorage`, and set the theme before first paint so the page doesn't flash.
  - Define all colours as CSS custom properties.
- No skill bars or percentage ratings.
- Use semantic HTML and keep enough contrast in both themes. The theme toggle must work from the keyboard, and the layout must work at phone width.

## Roadmap

Tick each item off when its PR is merged.

1. [x] `CLAUDE.md`
2. [x] Astro skeleton and GitHub Actions deploy, live at `nathanaelcammay.github.io/portfolio/`
3. [x] Base layout, theme toggle, and the Home, About and Contact pages
4. [x] Projects collection, with this site as the first entry
5. [x] Custom domain: buy it, point DNS at GitHub Pages, turn on HTTPS, remove `base`
6. [ ] Email on the domain. **Deferred** until he takes on freelance work. Don't bring it up before then. When it's time, he'll want to send *and* receive as the domain, not just forward.
7. [x] Polish: SEO meta tags, favicon, social preview image, Lighthouse pass
