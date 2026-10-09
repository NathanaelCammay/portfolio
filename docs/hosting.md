# How this site is built and hosted

This document explains how code in this repo ends up as a live website. It grows as each piece of infrastructure is added.

## The big picture

```
You merge a PR into main
        │
        ▼
GitHub Actions starts a fresh Linux machine and runs .github/workflows/deploy.yml
        │
        ├── build job:  install dependencies → astro build → package dist/
        │
        └── deploy job: hand the package to GitHub Pages
                │
                ▼
GitHub Pages serves the files at https://nathanaelcammay.github.io/portfolio/
```

Nothing runs on your own computer for a deploy. Merging is the deploy.

## 1. The build: from source code to plain files

**What it is.** Browsers only understand HTML, CSS and JavaScript. We write the site in a more convenient form:
- Astro pages (`src/pages/*.astro`)
- React components (`src/components/*.tsx`)
- later, Markdown for projects

`npm run build` runs Astro, which turns all of that into a `dist/` folder of plain files that any web server can hand out. That process is called a **build**.

**Static site.** Astro runs the React components once, at build time, and saves the HTML they produce. Visitors download that finished HTML, so their browser doesn't have to run React to draw the page. A component only sends JavaScript to the browser when it's marked as interactive (for example `<ThemeToggle client:load />`). This is called a **static site**: no server code runs when someone visits. The server just sends files that were built in advance.

**Why we need it.** Without a build there is nothing a browser can read. Raw `.astro` and `.tsx` files mean nothing to it.

**What breaks without it.** If the build fails, for example because of a typo in a component, no new `dist/` is produced and the deploy stops. The previous version of the site stays live. That's why every PR runs the build first (see the next section).

**Try it locally:**
- `npm run build`: produces `dist/`
- `npm run preview`: serves `dist/` at a local address, so you can see exactly what will go live

## 2. GitHub Actions: the robot that builds and deploys

**What it is.** GitHub Actions is GitHub's automation service, often called **CI/CD**:
- **Continuous Integration:** every change gets checked automatically.
- **Continuous Deployment:** every approved change gets released automatically.

A **workflow** is a YAML file in `.github/workflows/` that says *when* to run (the triggers) and *what* to run (the jobs). Each job gets a brand-new virtual machine. It starts empty, runs the steps, and is thrown away afterwards.

Our workflow, `.github/workflows/deploy.yml`:

| Trigger | What happens |
|---|---|
| A pull request is opened or updated | **build** job only. This is a check: the PR shows a green tick if the site builds, or a red cross if it doesn't. |
| A push to `main` (merging a PR counts) | **build** job, then **deploy** job. The site goes live. |
| The "Run workflow" button on the Actions tab | Same as a push to `main`. Handy for redeploying without changing code. |

The steps reuse ready-made actions instead of writing everything by hand:
- `actions/checkout`: downloads the repo's code onto the fresh machine.
- `withastro/action`: Astro's official action. It installs Node and the exact dependency versions in `package-lock.json`, runs the build, and packages `dist/` in the format GitHub Pages expects.
- `actions/deploy-pages`: tells GitHub Pages to start serving that package.

**Permissions.** Each job only gets the access it needs:
- The build job can read the repo, and nothing else.
- The deploy job can write to Pages. It can also request a short-lived identity token (`id-token`), which proves to Pages that the upload really came from this repo's workflow.

**Why we need it.**
- You never build or upload anything by hand.
- Every deploy happens the same way, on a clean machine, so "it worked on my laptop" problems can't sneak in.
- Every PR is tested before it can reach the live site.

**What breaks without it.** You'd have to build on your laptop and upload the files yourself every time. Sooner or later someone forgets a step, or uploads a broken build.

**Where to watch it.** The repo's **Actions** tab lists every run. Click into one to see each step's log. If a deploy fails, the red step's log says why.

## 3. GitHub Pages: the web server

**What it is.** A **web server** is a computer that's always on and connected to the internet. When a browser asks for a page, the server sends back the file. GitHub Pages is GitHub's free web server for static sites. It also provides HTTPS: the padlock, encrypting traffic between the visitor and the server.

**The one-time setting.** Pages has to be told where its files come from. In the repo, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**. The alternative, "Deploy from a branch", serves files straight from a branch with no build step, and that doesn't work for a site that needs building.

**Why the URL ends in `/portfolio/`.** Every GitHub account gets one address: `nathanaelcammay.github.io`.
- A repo named exactly `nathanaelcammay.github.io` is served at the root of that address.
- Every other repo is served in a sub-folder named after the repo, so this one lives at `/portfolio/`.

That's why `astro.config.mjs` sets `base: '/portfolio'`. Every link and asset path has to start with `/portfolio/`. A link to `/favicon.svg` would point at `nathanaelcammay.github.io/favicon.svg`, which doesn't exist, so it would 404.

To avoid that, internal links are built with the `url()` helper in `src/lib/url.ts`, which adds the base automatically. When the custom domain is connected (roadmap step 5), the site moves to the root of its own address. At that point we delete the `base` line, and every link still works.

**What breaks without it.** Without Pages, the build would produce files that nobody can visit. Without the correct `base`, the page itself loads, but its styles, images and links break.

## 4. Smaller pieces

- **`package-lock.json`** records the exact version of every dependency, including the dependencies of dependencies. The build machine installs from it, so it uses exactly what was tested locally. Always commit it.
- **`.gitattributes`** makes Git store text files with Unix line endings (LF). Windows uses CRLF. Without this rule, files can show up as "changed" when nothing changed but invisible line-ending characters.
- **`.gitignore`** lists things that should never be committed:
  - `node_modules/`: hundreds of megabytes, and reinstalled from the lockfile anyway.
  - `dist/`: rebuilt on every deploy.
  - `.astro/`: generated types.

## Coming later

- **Custom domain, DNS and HTTPS** (roadmap step 5)
- **Email on the domain** (roadmap step 6)
