# madironman.github.io

Personal site of P. R. Madhevan. Built with [Astro](https://astro.build), deployed to GitHub Pages. Live at https://madironman.github.io.

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

## Content rules

Everything on the site is written under an employer NDA. The rules that keep it safe:

- Experience describes the kind of work and the skills used. No customer part numbers, platform code names, defect specifics, roadmap items or internal metrics.
- Writing covers public mechanisms: standards, architecture, debugging methods. Not client incidents.
- Tooling cards describe the class of problem, not the implementation. No code, no repos.
- Projects are pre-employment or generic study material only.
- The resume at `public/resume.pdf` is the NDA-scrubbed version (Resume_6). Never copy an older version over it.

## Deploy

Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and publishes. Pages source is set to GitHub Actions.
