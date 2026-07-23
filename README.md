# reneleo.com

The third iteration of Rene Gonzalez's personal website: a static, content-first field journal built with Astro.

## Stack

- Astro with strict TypeScript
- React islands for the interactive timeline and theme control
- Motion for timeline state transitions
- MapLibre GL JS for progressively enhanced locations and routes
- Markdown and YAML content collections validated at build time
- Netlify for deployment

## Local development

Use Node 24 and install dependencies into this repository:

```powershell
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:4321`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Astro's development server |
| `npm run check` | Validate Astro and TypeScript |
| `npm run build` | Create the production site in `dist/` |
| `npm run verify:build` | Verify preserved routes, assets, and homepage metadata |
| `npm run preview` | Serve the production output locally |
| `npm run format` | Format source and content files |

## Editing the site

- Update name, hero copy, workplaces, and social links in `src/content/profile.yml`.
- Add a timeline event as one Markdown file in `src/content/timeline/`.
- Add or update projects in `content/projects/`.
- Add writing in `content/posts/<slug>/index.md`.
- Place timeline media beside its event or in `public/` when its URL must remain stable.

Content schemas live in `src/content.config.ts`. Invalid dates, unsupported media types, malformed links, and missing required fields fail the build.

## Branches and deployment

- `v3` is the production and GitHub default branch.
- `v3-build` is the implementation branch while the redesign is validated.
- Netlify publishes production builds from `v3`.
- GitHub Actions validates pushes to `v3-build` and pull requests into `v3`.

The current production site remains unchanged until the validated redesign is merged into `v3`.
