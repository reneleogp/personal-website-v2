# Personal Website v3 Migration Plan

## Document status

- **Purpose:** Guide the complete Astro rebuild of `reneleo.com` in its existing standalone GitHub repository.
- **Chosen direction:** Develop on `v3-build`, validate through GitHub Actions and Netlify previews, then merge into production branch `v3`.
- **Current production repository:** `reneleogp/personal-website-v2`
- **Current production domain:** `https://reneleo.com`
- **Hosting:** Netlify
- **Last reviewed:** July 22, 2026

## Executive decision

Build the next website in `reneleogp/personal-website-v2` after permanently detaching it from the `bchiang7/v4` fork network. GitHub now reports `fork: false`, `v3` is the default and Netlify production branch, and `main` remains the untouched v2 reference.

The rewrite replaces the inherited Gatsby runtime, visual system, and dependencies while preserving authored content, stable URLs, the domain, public downloads, and Git history. Active implementation happens on `v3-build`; production remains unchanged until cloud checks and a deploy preview pass.

## Confirmed repository status

The GitHub API and Git remotes now report:

- `reneleogp/personal-website-v2` has `fork: false`.
- `v3` is GitHub's default branch and the configured Netlify production branch.
- `v3-build` is the non-production implementation branch.
- `main` remains available as the v2 reference.
- the obsolete `bchiang7/v4` upstream remote has been removed.

The configured Git remote is:

```text
origin    https://github.com/reneleogp/personal-website-v2.git
```

## Can the existing repository be detached?

Yes. GitHub now provides a supported **Leave fork network** operation.

For an eligible repository:

1. Open the repository on GitHub.
2. Open **Settings**.
3. On **General**, scroll to **Danger Zone**.
4. Select **Leave fork network**.
5. Read and confirm the permanent effects.
6. Enter the repository name and complete the operation.

GitHub currently permits this when the fork:

- is public;
- is smaller than 1 GB; and
- has no child forks.

The current repository appears to satisfy those conditions, but the GitHub settings page is authoritative.

Leaving the network is permanent. Git commit metadata is retained, but GitHub warns that issues, pull requests, wikis, stars, watchers, comments, child forks, and other fork-associated metadata are not retained. The standalone repository cannot later rejoin the old fork network.

### When detaching is the right choice

Detach the current repository if all of these are true:

- preserving the existing GitHub repository URL is important;
- preserving the current commit history is desirable;
- the “forked from” label is the main problem; and
- the new site will be developed in the same repository.

### Completed decision

Detachment is complete. The repository must not be re-created, mirror-pushed, or reconnected to the former upstream. The v3 implementation removes obsolete Gatsby files in its branch while Git history and `main` preserve the previous version.

## Why Astro

Astro is a recommendation, not a visual-design requirement. The site can look identical in Gatsby, Next.js, or another framework. Astro is recommended because its architecture matches the product being built.

### 1. The website is content-first

Most pages are biography, timeline entries, projects, and writing. They should be rendered to complete HTML at build time. Astro defaults to static output and does not require turning the whole website into a client-side React application.

### 2. Only one area needs substantial client-side behavior

The timeline needs active-entry tracking, media transitions, sticky presentation, and optional maps. Astro can render the rest of the page as static HTML and hydrate only the timeline explorer as a React island. That reduces JavaScript without giving up React where it is useful.

### 3. Structured editing is a first-class feature

Astro content collections provide:

- Markdown and MDX content;
- schema validation with Zod;
- generated TypeScript types and editor autocomplete;
- predictable querying and sorting;
- local image references validated at build time; and
- build failures when required metadata or image alt text is missing.

This directly supports the requirement that adding a life event should mean adding one structured content file, not editing a React component.

### 4. Images are central to the timeline

Astro can generate responsive image sizes and modern formats from local images. It also records dimensions to prevent layout shift. Photos can live beside the timeline entry that uses them.

### 5. SEO remains simple and inspectable

Titles, descriptions, canonical links, structured data, timeline copy, and writing all exist in the initial HTML. A crawler does not need to execute the interactive timeline to discover the content.

### 6. It removes an overdue platform upgrade

The current project uses Gatsby 3, React 17, and Node 14. Node 14 has been end-of-life for years, and the Gatsby stack would require a major upgrade before redesign work begins. A fresh Astro repository avoids spending migration effort on an implementation that will then be substantially replaced.

### Costs and tradeoffs

- The Gatsby templates and GraphQL queries must be replaced.
- Astro's component syntax must be learned.
- React libraries can only run inside hydrated islands.
- A server-heavy application would be better served by a framework such as Next.js.
- A visual CMS would require additional integration later.

None of those costs are significant for a mostly static personal website. If future requirements change to authenticated dashboards, frequently updated server data, or complex API routes, reassess the framework before implementation.

## Product scope

### Primary homepage

The first release should contain:

1. A restrained navigation bar.
2. A minimal hero with Rene's name, selected workplaces, and one personal detail such as backpacking.
3. A chronological life timeline combining work, education, projects, travel, and personal milestones.
4. A sticky media stage on desktop that can show a photograph, video, map, route, or illustration for the active event.
5. Inline media on mobile.
6. Authored sticky notes that add context to timeline events.
7. A small writing preview or link to the writing archive.
8. A minimal footer with email, LinkedIn, GitHub, and resume links.

### Secondary pages

- Writing index at `/pensieve/`.
- Individual writing pages under `/pensieve/<slug>/`.
- Tag pages under `/pensieve/tags/<tag>/` if tags remain useful.
- Project archive at `/archive/` for URL compatibility, even if the navigation label becomes “Projects.”
- Custom `/404/` page.

### Explicitly out of scope for the first release

- A database or authenticated admin interface.
- A headless CMS.
- User-created public notes.
- A custom map tile server.
- Scroll-jacking or artificial smooth scrolling.
- A prebuilt portfolio timeline component.
- Rebuilding every old project demo.

## Proposed technology baseline

Use current stable versions at the time implementation starts and commit the lockfile.

| Concern | Choice | Reason |
| --- | --- | --- |
| Site framework | Astro, static output | Content-first HTML with selective hydration |
| Language | TypeScript, strict mode | Safe schemas, component props, and refactors |
| Interactive island | React integration | Existing familiarity and Motion support |
| Timeline motion | Motion for React | In-view state, keyed crossfades, and reduced-motion support |
| Maps | MapLibre GL JS, dynamically imported | Flexible maps without coupling the whole page to a map runtime |
| Content | Astro content collections | Validated Markdown/YAML with generated types |
| Styling | CSS custom properties and scoped CSS | Small runtime, transparent theming, no CSS-in-JS dependency |
| Images | `astro:assets` | Responsive output and layout-shift prevention |
| Icons | Lucide | Consistent accessible interface icons |
| Unit tests | Vitest where logic warrants it | Fast validation of parsers and utilities |
| Browser tests | Playwright | Timeline, theme, navigation, and viewport behavior |
| Hosting | Netlify | Preserve the existing deployment platform and domain workflow |

Use the current Astro-supported Node LTS release and pin it in `.nvmrc`. Do not carry forward Node `14.16.0` from the Gatsby repository. At implementation time, Node 24 LTS should be evaluated first and replaced only if the selected Astro version documents a different supported range.

## V3 repository structure

```text
personal-website-v2/
|-- .github/
|   `-- workflows/
|       `-- validate.yml
|-- public/
|   |-- favicon.svg
|   |-- robots.txt
|   |-- Rene_Gonzalez_resume.pdf
|   `-- slides/
|       `-- intro-to-webdev-workshop.pdf
|-- scripts/
|   `-- new-timeline-entry.mjs
|-- src/
|   |-- assets/
|   |   |-- brand/
|   |   `-- social/
|   |-- components/
|   |   |-- base/
|   |   |-- hero/
|   |   |-- seo/
|   |   |-- theme/
|   |   `-- timeline/
|   |-- content/
|   |   |-- profile/
|   |   |   `-- main.yml
|   |   |-- projects/
|   |   |-- timeline/
|   |   `-- writing/
|   |-- layouts/
|   |   |-- BaseLayout.astro
|   |   `-- WritingLayout.astro
|   |-- pages/
|   |   |-- 404.astro
|   |   |-- archive.astro
|   |   |-- index.astro
|   |   `-- pensieve/
|   |       |-- [...slug].astro
|   |       |-- index.astro
|   |       `-- tags/
|   |           `-- [tag].astro
|   |-- styles/
|   |   |-- global.css
|   |   |-- tokens.css
|   |   `-- typography.css
|   `-- content.config.ts
|-- tests/
|   `-- e2e/
|-- astro.config.mjs
|-- netlify.toml
|-- package.json
|-- tsconfig.json
`-- README.md
```

Keep timeline photographs beside their entries when practical:

```text
src/content/timeline/2024-commure/
|-- index.md
|-- team.webp
`-- office.webp
```

This makes deleting, moving, or reviewing an event self-contained.

## Content model

### Profile

Store site-wide authored information in `src/content/profile/main.yml` and validate it as a one-entry collection.

Suggested fields:

```yaml
name: Rene Gonzalez
shortBio: Software engineer building useful systems and collecting routes along the way.
hero:
  professional: Previously at Commure, WSIB, Toolbx, and early-stage teams.
  personal: Usually planning the next backpacking route.
email: reneleogp0305@gmail.com
social:
  github: https://github.com/reneleogp
  linkedin: https://www.linkedin.com/in/reneleogp
resume: /Rene_Gonzalez_resume.pdf
```

This file should be the only source for hero copy, primary social links, and contact details.

### Timeline entry

Each event is one Markdown file. The Markdown body is optional extended copy.

```yaml
---
title: Joined Commure
startDate: 2024-09-02
endDate: 2024-12-20
kind: work
eyebrow: Software Engineer Intern
summary: Worked on revenue-cycle infrastructure used by healthcare facilities.
location:
  label: Mountain View, California
  coordinates: [-122.0839, 37.3861]
media:
  - kind: image
    src: ./team.webp
    alt: The Commure team gathered outside the Mountain View office
    caption: Fall 2024
notes:
  - text: My first role working on healthcare infrastructure.
    tone: yellow
    placement: outer
links:
  - label: Commure
    url: https://www.commure.com/
featured: true
draft: false
---

Optional longer reflection written in Markdown.
```

Schema rules should include:

- `startDate` is required and coercible to a date.
- `endDate` is optional but cannot precede `startDate`.
- `kind` is one of `work`, `education`, `project`, `travel`, or `life`.
- `summary` is required and concise enough for the timeline.
- coordinates use `[longitude, latitude]`, in that order.
- every informative image requires meaningful alt text.
- `draft: true` entries are excluded from production but visible locally.
- media types are explicitly enumerated.
- sticky note tone and placement use controlled values.

Supported media for the first release:

| Kind | Required data | Rendering behavior |
| --- | --- | --- |
| `image` | local source, alt text | Responsive optimized image |
| `video` | local or hosted MP4/WebM, poster, caption | Muted controls; never surprise autoplay |
| `map` | coordinates, label, zoom | Static fallback plus optional interactive MapLibre view |
| `route` | GeoJSON/GPX-derived path, bounds, label | Map with route line and start/end markers |
| `illustration` | local source, alt text | Responsive image without photo treatment |

Avoid GIF files for substantial animation. Convert them to MP4/WebM and provide a poster image. This is smaller, more controllable, and easier to disable for reduced motion.

### Sticky notes

Sticky notes are content annotations, not free-positioned page elements.

```yaml
notes:
  - text: Took the train across the country before starting this role.
    tone: coral
    placement: media
    link:
      label: See the route
      url: https://example.com/
```

Allowed tones:

- `yellow`
- `blue`
- `coral`
- `green`

Allowed placements:

- `inner`: near the event copy;
- `outer`: slightly outside the timeline column on wide screens; and
- `media`: overlaid near a safe edge of the media stage on wide screens.

On narrow screens, all placements collapse into normal inline callouts. Rotation and offsets are deterministic design tokens, not authored pixel coordinates.

### Writing

Preserve existing slugs. Suggested frontmatter:

```yaml
---
title: Dark Mode Toggle
description: Dark mode without the flash of the default theme.
publishedAt: 2021-04-21
updatedAt: 2026-08-01
slug: dark-mode-toggle
tags:
  - accessibility
  - css
draft: false
---
```

The generated route remains `/pensieve/dark-mode-toggle/`, even though the stored slug no longer includes `/pensieve/`.

### Projects

Projects should remain a separate collection so the archive can show richer technical metadata. A timeline event may reference a project by ID rather than duplicate its description.

Suggested fields:

- title;
- summary;
- date or date range;
- technologies;
- external URL;
- source URL;
- App Store/Play Store URLs;
- featured status;
- archive status; and
- optional related timeline entry.

## Timeline interaction contract

### Desktop

- Use a two-column section.
- Keep timeline entries in normal document flow on the left.
- Keep a fixed-aspect-ratio media stage `position: sticky` on the right.
- Activate the event nearest an intentional viewport threshold, approximately the vertical center.
- Hovering an event may preview it, but focus and click must provide the same behavior.
- Clicking an event locks it as active until another entry is selected or scrolling clearly advances.
- Crossfade media with stable dimensions so the page does not shift.
- Load MapLibre only when the first map or route becomes relevant.

### Mobile and narrow tablets

- Render each event's primary media below its text.
- Disable the sticky media stage.
- Do not create horizontal page scrolling.
- Keep sticky notes inline.
- Do not require hover.

### Reduced motion

- Replace movement and parallax with instant changes or short opacity fades.
- Do not autoplay looping media.
- Do not animate map camera travel; jump directly to the selected location.
- Preserve every interaction and piece of content when animation is disabled.

### No-JavaScript behavior

- All event headings, dates, summaries, notes, and links remain readable.
- Each event renders its primary image or a meaningful media fallback.
- Maps render a static preview, location label, or external map link.
- The timeline remains a chronological document rather than an empty app shell.

## Theme and visual foundation

The first visit must use light mode, even if the operating system prefers dark mode. After the visitor explicitly changes the theme, persist that choice in `localStorage` and apply it before first paint on later visits.

Initial palette direction:

| Token | Light | Dark |
| --- | --- | --- |
| Background | `#F8FAF8` | `#111512` |
| Surface | `#FFFFFF` | `#181D19` |
| Primary text | `#171A18` | `#F1F4F0` |
| Muted text | `#626A65` | `#AAB3AC` |
| Rule | `#DDE2DD` | `#343B36` |
| Primary accent | `#C94734` | `#FF745E` |
| Secondary accent | `#2E6B57` | `#79B89D` |

Use an expressive display face sparingly for Rene's name and major editorial moments, and a highly readable sans serif for body text and controls. Self-host fonts and define fallbacks to avoid blocking rendering.

Before implementation, create low-fidelity desktop and mobile wireframes. Confirm content density and interaction states before polishing colors or animation.

## Current content inventory

The current repository contains 20 Markdown entries:

| Existing group | Count | New destination |
| --- | ---: | --- |
| Jobs | 5 | Timeline `kind: work` |
| Projects | 8 | Projects collection; selected items also get timeline references |
| Posts | 5 | Writing collection with preserved slugs |
| Featured case studies | 2 | Merge into projects or writing after deduplication |

### Existing jobs

- Commure
- DUC APP
- Live Coin Watch
- Toolbx
- WSIB

Do not simply copy resume bullets into the life timeline. Rewrite each as a short human narrative, then retain detailed accomplishments in the resume or expanded project content.

### Existing public assets

Review and deliberately migrate:

- `static/Rene_Gonzalez_resume.pdf`
- `static/slides/intro-to-webdev-workshop.pdf`
- `static/og.png`
- `static/og@2x.png`
- useful favicon source assets

Generate a new Open Graph image and favicon set for the new visual identity. Keep the existing filenames or add redirects when public URLs have already been shared.

The old `logo.png` and `demo.png` should be treated as references, not automatically migrated.

## URL preservation map

Preserving public URLs is more important than preserving Gatsby's file structure.

| Current URL | New URL | Action |
| --- | --- | --- |
| `/` | `/` | Preserve |
| `/archive/` | `/archive/` | Preserve; label may change to Projects |
| `/pensieve/` | `/pensieve/` | Preserve |
| `/pensieve/clickable-cards/` | Same | Preserve |
| `/pensieve/dark-mode-toggle/` | Same | Preserve |
| `/pensieve/docker-error/` | Same | Preserve exact historical slug |
| `/pensieve/markdown-playground/` | Same | Preserve or issue an intentional 301 |
| `/pensieve/wordpress-publish-error/` | Same | Preserve |
| `/pensieve/tags/<tag>/` | Same | Preserve while tags remain published |
| `/Rene_Gonzalez_resume.pdf` | Same | Preserve |
| `/slides/intro-to-webdev-workshop.pdf` | Same | Preserve |

Before launch, build the old Gatsby site and save its generated sitemap as a migration artifact. Compare every indexed URL with the Astro build. Any intentionally changed URL must have a single-hop `301` redirect in Netlify configuration.

Do not redirect removed pages to the homepage. Redirect to the closest equivalent content or return a useful `404`.

## SEO migration requirements

Retain or improve the current SEO baseline:

- `https://reneleo.com` as the canonical site URL;
- unique page titles and descriptions;
- canonical links;
- Open Graph title, description, URL, type, and image;
- Twitter card metadata;
- `sitemap.xml`;
- `robots.txt`;
- semantic heading hierarchy;
- descriptive image alt text;
- visible captions for contextual media;
- stable writing URLs;
- an RSS feed for writing; and
- a useful 404 page.

Add JSON-LD:

- `Person` and `WebSite` on the homepage;
- `BlogPosting` on individual writing pages; and
- `BreadcrumbList` where navigation depth warrants it.

Update the old description, which still says Rene studies computer science at Waterloo. Site metadata must reflect the current biography at launch.

Carry forward the Google site verification token only if the same Search Console property remains active. Verify ownership after deployment.

Do **not** blindly migrate the `UA-45666519-2` Google Universal Analytics ID. Universal Analytics is obsolete. Choose one of these explicitly:

1. no analytics;
2. privacy-focused analytics such as Plausible or Umami; or
3. a current GA4 property with consent and privacy behavior appropriate to the audience.

## Accessibility requirements

- Every interaction works with keyboard and touch.
- Hover only enhances an interaction; it never reveals exclusive content.
- Timeline entries use buttons or links only when they perform those semantics.
- The active timeline state is conveyed with more than color.
- Focus remains visible in light and dark themes.
- Theme controls have accessible names and pressed state.
- Motion respects `prefers-reduced-motion`.
- Videos have controls, captions when speech matters, and no unexpected audio.
- Map content has a textual location and non-map fallback.
- Sticky notes appear in logical reading order.
- Text and controls meet WCAG AA contrast targets.
- The layout remains usable at 200% zoom and with enlarged text.

## Performance requirements

- Ship no React runtime outside components that need it.
- Hydrate the timeline near visibility rather than on initial page load when practical.
- Dynamically import MapLibre.
- Render a static map fallback before interactive code loads.
- Use responsive AVIF/WebP output for photographs.
- Define dimensions or aspect ratios for all media.
- Lazy-load below-the-fold media.
- Preload only the critical font subset and hero asset.
- Avoid autoplaying multiple videos.
- Keep third-party scripts out of the critical rendering path.

Target Lighthouse scores of at least 95 for Performance, Accessibility, Best Practices, and SEO on representative mobile and desktop runs. Treat Core Web Vitals regressions as release blockers.

## Branch and validation procedure

The repository and branches are already established:

1. Implement the rewrite on `v3-build`.
2. Push `v3-build` to run GitHub Actions on infrastructure that can access npm.
3. Commit the generated `package-lock.json` after the first successful cloud install.
4. Validate a Netlify deploy preview, preserved URLs, responsive layouts, maps, reduced motion, and accessibility.
5. Merge the reviewed branch into `v3` to trigger the production deployment.
6. Keep `main` unchanged as the v2 rollback reference.

Do not add `bchiang7/v4` as an upstream remote or push incomplete work directly to `v3`.

## Implementation phases

### Phase 0: Freeze decisions and capture the old site

- [x] Confirm the detached standalone repository and branch strategy.
- [x] Set `v3` as GitHub's default and Netlify's production branch.
- [ ] Export or capture the old production sitemap.
- [ ] Record current Lighthouse results and representative screenshots.
- [ ] Record all current Netlify environment variables and build settings without committing secrets.
- [ ] Download or locate original-resolution timeline photos and videos.
- [ ] Identify which travel locations are safe to publish precisely.
- [ ] Decide whether writing and tag archives remain in the first release.
- [ ] Decide on analytics.

Exit criterion: every existing public URL and asset is represented in a migration inventory.

### Phase 1: Create the standalone foundation

- [ ] Scaffold the Astro repository with strict TypeScript.
- [ ] Add the React integration for the timeline island.
- [ ] Add formatting, linting, `astro check`, and test scripts.
- [ ] Add a validation workflow for pull requests and `main`.
- [ ] Configure Netlify build output as `dist`.
- [ ] Establish global tokens, typography, layout primitives, and breakpoints.
- [ ] Implement light-first theme initialization without a flash.
- [ ] Implement the base layout and SEO component.

Exit criterion: a minimal page builds, deploys to a preview URL, and has correct metadata in raw HTML.

### Phase 2: Define structured content

- [ ] Define profile, timeline, project, and writing collections.
- [ ] Add Zod validation for dates, media, notes, links, and drafts.
- [ ] Add production filtering for drafts.
- [ ] Add a `new:timeline` script that creates a valid event folder and starter Markdown.
- [ ] Add example entries for one work event, one travel event, and one project.
- [ ] Document the authoring workflow in the new README.

Exit criterion: invalid dates, missing alt text, unknown note colors, and unsupported media kinds fail validation.

### Phase 3: Build the homepage shell

- [ ] Implement quiet navigation and skip link.
- [ ] Implement the minimal hero from profile content.
- [ ] Include workplaces as a restrained line, not a logo wall.
- [ ] Include one personal detail, initially backpacking.
- [ ] Leave a visual hint of the timeline below the fold on common viewports.
- [ ] Implement the footer and resume link.

Exit criterion: the page is complete and readable without the interactive timeline.

### Phase 4: Build the timeline

- [ ] Render semantic timeline HTML from the collection.
- [ ] Implement desktop two-column layout and native sticky media.
- [ ] Implement active entry detection with Motion or pooled intersection observation.
- [ ] Add focus, hover, click, and scroll state rules.
- [ ] Add stable keyed media crossfades.
- [ ] Add inline mobile media behavior.
- [ ] Add sticky note placement and tone tokens.
- [ ] Implement reduced-motion variants.
- [ ] Verify no-JavaScript fallbacks.

Exit criterion: all content remains available across desktop, mobile, keyboard, touch, reduced motion, and disabled JavaScript.

### Phase 5: Add maps and routes

- [ ] Select a map style/tile provider and review cost, attribution, and privacy terms.
- [ ] Dynamically load MapLibre only for map-bearing entries.
- [ ] Add static fallback previews.
- [ ] Implement point locations first.
- [ ] Add route rendering only after point locations are stable.
- [ ] Disable scroll zoom by default so the page remains easy to scroll.
- [ ] Use cooperative gestures if interactive zoom is enabled.
- [ ] Avoid publishing home addresses or overly precise personal locations.

Exit criterion: map failure, blocked scripts, or unsupported WebGL never hides the location narrative.

### Phase 6: Migrate current content

- [ ] Rewrite five job entries as timeline narratives.
- [ ] Transform eight project files into the projects schema.
- [ ] Select which projects also deserve timeline events.
- [ ] Migrate five writing posts while preserving URLs.
- [ ] Merge or reclassify two Spotify featured entries to eliminate duplication.
- [ ] Copy the resume and workshop PDF to preserved paths.
- [ ] Replace old brand images with the new favicon and Open Graph image.
- [ ] Validate all external links.

Exit criterion: the new content inventory accounts for all 20 Markdown entries and every retained public asset.

### Phase 7: Restore secondary routes and SEO

- [ ] Implement `/archive/`.
- [ ] Implement `/pensieve/` and individual posts.
- [ ] Implement tag pages or redirects for intentionally removed tags.
- [ ] Generate sitemap and RSS output.
- [ ] Add canonical, Open Graph, Twitter, and JSON-LD metadata.
- [ ] Add Netlify redirects for every changed URL.
- [ ] Verify Search Console ownership.

Exit criterion: an automated URL comparison finds no unexplained missing routes.

### Phase 8: Quality assurance

- [ ] Run formatting, linting, type checking, unit tests, and production build.
- [ ] Run Playwright at representative desktop and mobile viewports.
- [ ] Verify theme persistence and no first-paint theme flash.
- [ ] Verify keyboard interaction and focus order.
- [ ] Verify reduced motion.
- [ ] Verify 200% zoom and long text wrapping.
- [ ] Verify images, video posters, maps, and fallbacks.
- [ ] Run Lighthouse and an accessibility scanner.
- [ ] Crawl the preview deployment for broken internal links.
- [ ] Test all historical public URLs against the preview.

Exit criterion: release criteria below pass with a production build, not only the development server.

### Phase 9: Netlify cutover

- [ ] Validate the `v3-build` deploy preview on the existing Netlify site.
- [ ] Configure build command `npm run build` and publish directory `dist`.
- [ ] Recreate only required environment variables.
- [ ] Test deploy previews from a pull request.
- [ ] Reduce DNS TTL ahead of cutover only if DNS will actually change.
- [x] Retain `reneleo.com` and the existing Netlify site configuration.
- [ ] Verify HTTPS, primary-domain redirects, headers, sitemap, and robots output.
- [ ] Keep the previous Netlify deploy available for rollback.

Exit criterion: production serves the new build, all canonical URLs use HTTPS, and the previous deploy can be restored quickly.

### Phase 10: Observe and retain v2

- [ ] Monitor Netlify errors and analytics for missing paths.
- [ ] Inspect Search Console indexing and sitemap processing.
- [ ] Correct unexpected 404s with specific 301 redirects.
- [ ] Keep `main` unchanged during the observation period.

## Expected package scripts

The v3 branch should converge on commands similar to:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "check": "astro check",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "new:timeline": "node scripts/new-timeline-entry.mjs"
  }
}
```

Exact scripts may change with the selected linting and testing setup, but `build`, `check`, formatting validation, and an end-to-end test command must be available to contributors and CI.

## Continuous integration

On pushes and pull requests, CI should:

1. install with the committed lockfile;
2. run formatting validation;
3. run Astro/TypeScript checks;
4. run unit tests;
5. build the static site; and
6. run a small browser smoke suite against the build.

Keep broad visual regression testing out of the first commit. Add screenshot baselines after the design stabilizes so CI does not encode temporary layouts.

## Release criteria

The new website is ready to replace production when all of the following are true:

- [x] The GitHub repository is not marked as a fork.
- [x] The `main` branch remains available for rollback and reference.
- [ ] The homepage is complete in light and dark modes.
- [ ] Light mode is the first-visit default.
- [ ] Timeline events can show images, maps, routes, videos, and notes through one validated schema.
- [ ] Desktop sticky media and mobile inline media both work.
- [ ] Hover is never the only way to reveal content.
- [ ] Reduced-motion and no-JavaScript fallbacks work.
- [ ] All retained writing and archive URLs resolve directly or through a single 301.
- [ ] Resume and workshop PDF URLs resolve.
- [ ] Canonical, social, sitemap, robots, and structured metadata are correct.
- [ ] There are no unexplained build, type, accessibility, or browser-test failures.
- [ ] Lighthouse targets are met on representative pages.
- [ ] Netlify rollback has been tested or documented.

## Recommended defaults for unresolved decisions

Use these unless a design or product decision deliberately changes them:

| Decision | Default |
| --- | --- |
| Repository | Existing detached `reneleogp/personal-website-v2` repository |
| Branches | `v3-build` for implementation, `v3` for production, `main` for v2 reference |
| Framework | Astro static output |
| Interactive UI | One React timeline island |
| Content source | Local validated Markdown/YAML |
| Theme | Light first, explicit preference persisted |
| Timeline order | Chronological with newest first only if the narrative reads naturally; otherwise oldest to newest |
| Desktop media | Native CSS sticky panel |
| Mobile media | Inline per event |
| Map engine | Dynamically imported MapLibre |
| Map scroll zoom | Disabled by default |
| Notes | Authored annotations with controlled tones and placement |
| Writing URLs | Preserve `/pensieve/` routes |
| Deployment | Existing Netlify site, deploy preview, then merge to production `v3` |
| V2 reference | Retain `main` and Git history |

## Final recommendation

Use the existing detached repository and its `v3-build` to `v3` promotion path. Preserve Rene's content, stable URLs, domain, resume, selected public assets, and SEO equity while removing the old Gatsby components, styling system, dependency graph, and inherited fork relationship from v3.