# madironman.github.io

Personal site of Madhevan Ramalingam, WLAN firmware and driver engineer. Built with [Astro](https://astro.build), deployed to GitHub Pages. Live at https://madironman.github.io.

## Run locally

    npm ci
    npm run dev      # http://localhost:4321
    npm run build    # static output in dist/

## Structure

- `src/pages/index.astro`: the home page. Hero, selected work (one case study per client engagement), writing, skills, invention disclosure and publication, education, contact.
- `src/pages/writing/[slug].astro`: one page per note in `src/content/writing/`. `/writing` redirects to the home page's Writing section.
- `src/data/resume.ts`: all resume-derived content.
- `src/data/site.ts`: identity and page metadata.
- `src/layouts/Base.astro`: head metadata, header, footer.
- `src/styles/global.css`: the only stylesheet, inlined into the page at build time.
- `public/Madhevan_Ramalingam_Resume.pdf`: the web copy of the resume. `/resume` redirects to it.

## Design rules

- Text first. No client-side JavaScript, web fonts, trackers or analytics.
- Light and dark follow the operating system setting. Printing gives a clean, light copy.
- Every text colour pair meets WCAG AA contrast.

## Content rules

Client work is under NDA.

- Content comes only from the signed-off resume, rephrased for the web at most. No new claims, numbers, technologies, team sizes or results.
- Keep the resume's scoping words: "Main contributor", "Contributed", "Design signed off; implementation under way when the engagement closed".
- No part or platform numbers, board names, internal module or tool names, register offsets, internal function names, ticket numbers, current-draw figures, or customer names beyond the four engagements on the page.
- No phone number anywhere, including the PDF.
- Notes in `src/content/writing/` cover public mechanisms (standards, architecture, debugging methods), not client incidents, and quote no current-draw figures. Frontmatter: `title`, `summary`, `date`, `tags`, and `draft: true` to keep a note out of the build.
- Before publishing, search `dist/` and the PDF's text for the private term list, which is kept outside this public repository.

## Deploy

Push to `main`. `.github/workflows/deploy.yml` builds with `withastro/action` and publishes to GitHub Pages (Pages source: GitHub Actions).
