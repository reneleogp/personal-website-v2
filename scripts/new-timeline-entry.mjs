import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const [slug, ...titleParts] = process.argv.slice(2);
const title = titleParts.join(' ').trim();

if (!slug || !title) {
  console.error('Usage: npm run new:timeline -- <yyyy-slug> "Event title"');
  process.exit(1);
}

if (!/^\d{4}-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('The slug must look like "2026-backpacking-trip".');
  process.exit(1);
}

const year = slug.slice(0, 4);
const outputDirectory = path.join(process.cwd(), 'src', 'content', 'timeline');
const outputPath = path.join(outputDirectory, `${slug}.md`);
const template = `---
title: '${title.replaceAll("'", "''")}'
startDate: ${year}-01-01
dateLabel: ${year}
kind: life
summary: Add a concise summary of what changed and why it mattered.
details:
  - Add an optional supporting detail or remove this list.
location:
  label: City, Country
  coordinates: [0, 0]
media:
  kind: map
  coordinates: [0, 0]
  zoom: 8
  label: City, Country
notes:
  - text: Add a small piece of context or remove this note.
    tone: yellow
    placement: inner
links: []
featured: true
draft: true
---

Optional longer reflection in Markdown.
`;

await mkdir(outputDirectory, { recursive: true });

try {
  await writeFile(outputPath, template, { encoding: 'utf8', flag: 'wx' });
  console.log(`Created ${path.relative(process.cwd(), outputPath)}`);
} catch (error) {
  if (error && typeof error === 'object' && 'code' in error && error.code === 'EEXIST') {
    console.error(`Refusing to overwrite ${path.relative(process.cwd(), outputPath)}`);
    process.exit(1);
  }
  throw error;
}