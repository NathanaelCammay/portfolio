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
GitHub Pages serves the files
        │
        ▼
Visitors type nathanaelcammay.com → DNS points them at GitHub Pages → they get the site over HTTPS
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

**Why the URL used to end in `/portfolio/`.** Every GitHub account gets one address: `nathanaelcammay.github.io`.
- A repo named exactly `nathanaelcammay.github.io` is served at the root of that address.
- Every other repo is served in a sub-folder named after the repo, so this one lives at `/portfolio/`.

Until the custom domain was connected, `astro.config.mjs` set `base: '/portfolio'`. Every link and asset path had to start with `/portfolio/`. A link to `/favicon.svg` would point at `nathanaelcammay.github.io/favicon.svg`, which doesn't exist, so it would 404.

To avoid that, internal links are built with the `url()` helper in `src/lib/url.ts`, which adds the base automatically. When the custom domain was connected, the site moved to the root of its own address. Removing the `base` line was the only change needed, and every link kept working. The helper is still used, in case a base path is ever needed again.

**What breaks without it.** Without Pages, the build would produce files that nobody can visit. Without the correct `base`, the page itself loads, but its styles, images and links break.

### How URLs map to files, and why we avoid redirects

A static server has no idea what an "About page" is. It only maps the URL path to a file in `dist/`. GitHub Pages tries these, in order:

| Request | Pages looks for |
|---|---|
| `/about` | `about.html`, or the folder `about/`, then redirects |
| `/about/` | `about/index.html` |

By default, Astro builds every page as a folder, e.g. `about/index.html`. Our links point to `/about`, with no trailing slash. So for every click, Pages found a folder and replied with **301 Moved Permanently**, telling the browser to try again at `/about/`. That's an extra round trip between the browser and the server before the page even starts loading.

`astro.config.mjs` now sets `build: { format: 'file' }`, so pages are built as `about.html`, `projects.html` and so on. `/about` now matches a file directly and loads with **200 OK**, with no redirect.

You can see this in your browser:
1. Open DevTools with F12 and go to the **Network** tab.
2. Click a nav link.
3. Look at the **Status** column. The document request should say `200`, not `301`.

**HTTP status codes worth knowing:**
- **200**: OK, here's the file.
- **301**: it's moved permanently, go to this other URL.
- **404**: there's no such file.
- **5xx**: the server itself broke. A static site on Pages basically never does this.

## 4. Smaller pieces

- **`package-lock.json`** records the exact version of every dependency, including the dependencies of dependencies. The build machine installs from it, so it uses exactly what was tested locally. Always commit it.
- **`.gitattributes`** makes Git store text files with Unix line endings (LF). Windows uses CRLF. Without this rule, files can show up as "changed" when nothing changed but invisible line-ending characters.
- **`.gitignore`** lists things that should never be committed:
  - `node_modules/`: hundreds of megabytes, and reinstalled from the lockfile anyway.
  - `dist/`: rebuilt on every deploy.
  - `.astro/`: generated types.

## 5. The domain: nathanaelcammay.com

### Who does what

Three separate jobs are involved, and they can be done by three different companies:

| Job | What it is | Who does it here |
|---|---|---|
| **Registrar** | Rents you the name, a year at a time | Cloudflare |
| **DNS** | The phonebook that says which server answers for the name | Cloudflare |
| **Hosting** | The server that actually sends the files | GitHub Pages |

**Nobody owns a domain outright. You rent it.**
- **ICANN** sets the global rules for domain names.
- **Verisign** runs the `.com` **registry**: the master list of who holds which `.com` name.
- A **registrar** like Cloudflare registers names on that list on your behalf, and handles renewals.

The registration runs a year at a time, and **auto-renew** is on. If it ever lapsed, the site and any email on the domain would stop working, and after a grace period anyone could buy the name.

**Settings on the Cloudflare side:**
- **Transfer lock** ("client transfer prohibited") stops the domain being moved to another registrar without your approval.
- **Privacy** hides your contact details from the public domain record. The registry still has them; the public doesn't.
- **Two-factor authentication** on the Cloudflare account matters most of all. Whoever controls that account controls the domain.

### DNS: the internet's phonebook

Computers connect to each other by **IP address**, not by name. When someone types `nathanaelcammay.com`, their browser first asks a **DNS resolver**, usually run by their ISP, Google or Cloudflare: "what's the address for this name?" The resolver finds out which **nameservers** are in charge of the domain. For us that's Cloudflare's, `melina.ns.cloudflare.com` and `yahir.ns.cloudflare.com`. It asks them, and passes the answer back. Only then does the browser connect.

The answers come from **records** we added in Cloudflare (**DNS → Records**):

| Type | Name | Points to | Why |
|---|---|---|---|
| A ×4 | `@` (the domain itself) | `185.199.108.153`, `.109.153`, `.110.153`, `.111.153` | GitHub Pages' IPv4 addresses |
| AAAA ×4 | `@` | `2606:50c0:8000::153` … `8003::153` | GitHub Pages' IPv6 addresses |
| CNAME | `www` | `nathanaelcammay.github.io` | Makes `www.` work too; GitHub redirects it to the bare domain |
| TXT | `_github-pages-challenge-NathanaelCammay` | a random string from GitHub | Proves to GitHub that we control the domain |
| TXT | `@` | `google-site-verification=…` | Proves to Google Search Console that we control the domain (see section 6) |

**What each record type does:**
- **A** maps a name to an IPv4 address: the classic four numbers, like `185.199.108.153`.
- **AAAA** maps a name to an IPv6 address, the newer and much larger address format. Some networks, especially mobile ones, prefer it, so we publish both.
- **Four addresses for redundancy:** each address is a different GitHub Pages entry point. A browser can use any of them, so the site stays up if one has problems.
- **CNAME** says "this name is an alias of that name, go and ask there". A name that has a CNAME can't have any other records, and that's why the root domain uses A and AAAA records instead.
- **TXT** is just text attached to a name. It doesn't direct visitors anywhere. Services use it to check ownership: GitHub gives you a random string, and only someone who controls the domain's DNS can publish it.
- **TTL** ("time to live") is how long resolvers may cache an answer before asking again. That's why DNS changes can take minutes, or occasionally hours, to show up everywhere.

**Why every record is "DNS only" (grey cloud), not "Proxied" (orange).** With the orange cloud, Cloudflare's servers sit between visitors and GitHub. Visitors would connect to Cloudflare, which would then fetch from GitHub. That gives you extra features (caching, attack protection), but GitHub would then see your domain pointing at Cloudflare instead of at itself, and it couldn't issue the HTTPS certificate. A static portfolio doesn't need the proxy, so we keep it simple.

**Domain verification (the TXT record).** You verify the domain once, in your GitHub *account* settings (**Settings → Pages → Verified domains**). It stops anyone else's GitHub repo from claiming `nathanaelcammay.com`. Without it, if your Pages site were ever switched off while the DNS still pointed at GitHub, someone else could attach their own site to your domain. That attack is called a **domain takeover**.

### Connecting the domain to the site

In the repo, go to **Settings → Pages → Custom domain**, enter `nathanaelcammay.com`, and click **Save**. GitHub then:
1. Checks the DNS records point at it. It shows "DNS check successful".
2. Serves the site at `https://nathanaelcammay.com/`, from the root, so the code no longer needs the `/portfolio` base.
3. Redirects `nathanaelcammay.github.io/portfolio/` and `www.nathanaelcammay.com` to `nathanaelcammay.com`, so old links keep working.

With a GitHub Actions deploy, the custom domain lives in that setting. No `CNAME` file is needed in the repo. That file is only used by the older "deploy from a branch" mode.

### HTTPS: the padlock

**HTTPS** encrypts traffic between the visitor and the server, so nobody in between can read or change it, whether that's public Wi-Fi or an ISP. It's also what makes browsers show the padlock instead of a "Not secure" warning.

It works through a **TLS certificate**: a file, signed by a trusted **certificate authority**, saying "this server really is nathanaelcammay.com". GitHub gets one free from **Let's Encrypt**. Let's Encrypt only issues it after confirming the domain's DNS really points at GitHub, which is another reason the records must be DNS only. Certificates expire after a few months, and GitHub renews them automatically.

When the certificate is ready (anywhere from a few minutes to an hour after saving the custom domain), tick **Enforce HTTPS** in the same settings page. Anyone who types `http://` is then redirected to `https://`.

**What breaks without each piece:**
- **No DNS records:** the name leads nowhere. The browser says "site can't be reached".
- **DNS records but no custom domain on GitHub:** GitHub receives the visit but doesn't know which site it's for, so it shows a GitHub 404 page.
- **Proxied (orange) records:** the certificate can't be issued, and the browser shows a security warning.
- **A lapsed registration:** everything stops, and the name can be lost.

## 6. How search engines and link previews see the site

People aren't the only visitors. Search engines crawl the site, and apps like LinkedIn and WhatsApp fetch it to build a preview card. None of them run your code. They read the HTML `<head>` and a couple of plain files, and `src/layouts/BaseLayout.astro` sets these up for every page.

| Piece | What it is | What breaks without it |
|---|---|---|
| `<title>` and `<meta name="description">` | The headline and snippet Google shows in search results | Google invents a snippet from random page text |
| `<link rel="canonical">` | "This is the one official address of this page" | `/about` and `/about.html` can be treated as duplicate pages, splitting their ranking |
| Open Graph tags (`og:title`, `og:image`, …) | What LinkedIn, WhatsApp, Slack and others show when the link is pasted | The shared link looks bare: no image, maybe the wrong title |
| `public/og-image.png` | The 1200×630 preview image, the size every platform expects | No image on the preview card |
| `/sitemap-index.xml` | A list of every page, generated at build time by `@astrojs/sitemap` | Search engines have to find pages by following links, so they may miss some |
| `public/robots.txt` | Tells crawlers what they may visit, and where the sitemap is | Crawlers still visit, but have to guess where the sitemap is |
| JSON-LD on the home page | Structured data saying "this site is about a Person called Nathanael Cammay, who is also these GitHub and LinkedIn profiles" | Google has to work out who the site is about by itself |
| `404.html` | The page GitHub Pages shows for any address that doesn't exist. It's marked `noindex` so it never appears in search | Visitors get GitHub's generic 404 page, with no way back to the site |

**Icons:** `public/favicon.svg` is the source. `npm run images` (`scripts/generate-images.mjs`) turns it into `favicon.ico` (for older browsers and tools) and `apple-touch-icon.png` (for phone home screens), and draws `og-image.png`. Re-run it after changing the icon or the preview text, then commit the results.

**After deploying**, it's worth checking:
- LinkedIn's [Post Inspector](https://www.linkedin.com/post-inspector/) shows exactly what your preview card looks like. It also makes LinkedIn re-read the page if you've changed it.
- [Google Search Console](https://search.google.com/search-console) is set up for this site (see below).

### Google Search Console

Search Console is Google's dashboard for site owners. It shows:
- which searches the site appeared in, and how often people clicked
- which pages Google has indexed
- any problems it found

**How it was set up:**
1. **Added a Domain property** for `nathanaelcammay.com`, rather than a "URL prefix" property. A Domain property covers every variant of the site in one place: `http`, `https`, `www` and any future subdomain. The catch is that it can only be verified through DNS.
2. **Verified ownership** with a TXT record on `@`, containing `google-site-verification=…`.
   - Only someone who controls the domain's DNS can publish that value, which is what makes it proof.
   - TXT records can share the root name with the A and AAAA records. Only CNAMEs have to be alone on a name.
   - **Don't delete it.** Google re-checks it from time to time, and removing it loses access to the property.
3. **Submitted the sitemap** under **Sitemaps**, as the full URL `https://nathanaelcammay.com/sitemap-index.xml`. A Domain property needs the full URL; a URL-prefix property would accept just the file name.
4. **Requested indexing** of the home page under **URL inspection**. This puts the page in Google's priority crawl queue.

**Indexing takes time.** It usually takes days, sometimes a couple of weeks, before searching your name shows the site and before the reports have data. Asking for indexing again doesn't speed it up. Check **Indexing → Pages** after about a week, to see which pages are indexed and why any aren't.

**Lighthouse** is Google's audit tool. It's built into Chrome DevTools, under the **Lighthouse** tab. It scores Performance, Accessibility, Best Practices and SEO out of 100, and lists anything that's wrong. This site scores 100 in all four. The one thing that cost points was React's runtime, which is loaded for the theme toggle. Hydrating the toggle with `client:idle` (once the page has finished loading) instead of `client:load` took it out of the critical path.

## Deferred

- **Email on the domain** (roadmap step 6): an address `@nathanaelcammay.com`, forwarded to Gmail or a full mailbox. Deferred until Nathanael is doing freelance work.
