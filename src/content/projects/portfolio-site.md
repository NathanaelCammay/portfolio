---
title: This portfolio site
summary: A static portfolio built with Astro and React, deployed to GitHub Pages through a GitHub Actions pipeline.
stack: [Astro, React, TypeScript, CSS, GitHub Actions, GitHub Pages]
date: 2026-10-09
repo: https://github.com/NathanaelCammay/portfolio
live: https://nathanaelcammay.github.io/portfolio/
---

## The problem

I needed one place to point clients, recruiters and hiring managers to: who I am, what I've worked on, and how to reach me. I also wanted to understand hosting end to end, from build pipelines and deployment to domains and DNS, rather than handing it to a website builder.

## The approach

I used Claude Code as a pair programmer and treated it like a teammate. Every change went through a pull request that I reviewed before merging, the same way I work at my day job.

- **Built with Astro, using React for the components.** Astro runs the React components at build time and ships plain HTML, so pages load fast and visitors download almost no JavaScript.
- **Deployed by a GitHub Actions workflow.**
  - Every pull request runs the build as a check.
  - Every merge to `main` builds the site and publishes it to GitHub Pages.
  - Nothing is uploaded by hand.
- **Content is kept separate from code.** Personal details live in one data file, and each project (like this one) is a Markdown file. Adding a project means adding one file.

## What I decided and why

**Astro + React instead of a plain React app.** A classic React single-page app has two problems on GitHub Pages:
- Refreshing or sharing a link like `/about` returns a 404, because that file doesn't exist on the server.
- Link previews on LinkedIn or WhatsApp see an empty page.

Astro keeps the React development experience but outputs real HTML for every page, which avoids both.

**Not Blazor, even though .NET is my main stack.** Blazor WebAssembly downloads the .NET runtime before it can show anything. That's a poor trade for a site that's mostly text. My .NET work shows up in my projects instead.

**GitHub Pages with an Actions pipeline.**
- It's free and needs no server to maintain.
- Building on every pull request means a broken change can't reach the live site.
- It's the same CI/CD idea I use with Azure DevOps at work, set up from scratch.

**Only ship JavaScript where it's needed.** The theme toggle is the only interactive component, so it's the only code that runs in the browser. A tiny inline script applies your saved theme before the page appears, so light-mode visitors don't see a flash of dark.

**Serve pages as `about.html`, not `about/index.html`.** With folder-style output, GitHub Pages answered every nav click with a redirect to add a trailing slash. Switching Astro's build format removed that extra round trip.

**Keep personal data minimal.** My phone number isn't on the site or in the downloadable CV. Email and LinkedIn are enough, and a public page attracts scrapers.
