# madhevan-site

Personal site of P. R. Madhevan. Built with [Astro](https://astro.build), deployed to GitHub Pages.

## Run locally

    npm install
    npm run dev

## Add a writing piece

Create `src/content/writing/<slug>.md` with frontmatter:

    ---
    title: "..."
    summary: "One line."
    date: 2026-09-06
    tags: [wlan, debug]
    draft: false
    ---

Set `draft: true` to keep it out of the build.

## Deploy

Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and publishes.
In the repo settings, set Pages > Source to "GitHub Actions" once.
