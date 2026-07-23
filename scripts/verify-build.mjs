import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const requiredPaths = [
  'dist/index.html',
  'dist/archive/index.html',
  'dist/pensieve/index.html',
  'dist/pensieve/clickable-cards/index.html',
  'dist/pensieve/dark-mode-toggle/index.html',
  'dist/pensieve/docker-error/index.html',
  'dist/pensieve/markdown-playground/index.html',
  'dist/pensieve/wordpress-publish-error/index.html',
  'dist/rss.xml',
  'dist/robots.txt',
  'dist/Rene_Gonzalez_resume.pdf',
  'dist/slides/intro-to-webdev-workshop.pdf',
];

const missingPaths = [];

for (const relativePath of requiredPaths) {
  try {
    await access(path.join(root, relativePath));
  } catch {
    missingPaths.push(relativePath);
  }
}

const hasNotFoundPage = await Promise.any([
  access(path.join(root, 'dist/404.html')).then(() => true),
  access(path.join(root, 'dist/404/index.html')).then(() => true),
]).catch(() => false);

if (!hasNotFoundPage) {
  missingPaths.push('dist/404.html (or dist/404/index.html)');
}

if (missingPaths.length > 0) {
  throw new Error(`Build is missing required output:\n${missingPaths.join('\n')}`);
}

const homepage = await readFile(path.join(root, 'dist/index.html'), 'utf8');
const requiredHomepageContent = [
  'Rene Gonzalez',
  'I have worked at',
  'Timeline',
  'Projects',
  'Notes',
  'Joined Commure',
  'Commure',
  'application/ld+json',
  'rel="canonical"',
];

for (const content of requiredHomepageContent) {
  if (!homepage.includes(content)) {
    throw new Error(`Homepage is missing expected content: ${content}`);
  }
}

const forbiddenHomepageContent = [
  'A Passionate Software Developer',
  'Life, in progress.',
  'Software Engineer Intern',
  'Full-Stack Developer Intern',
  'Centralized filtering for a platform',
];

for (const content of forbiddenHomepageContent) {
  if (homepage.includes(content)) {
    throw new Error(`Removed portfolio detail leaked into the homepage: ${content}`);
  }
}

console.log(`Verified ${requiredPaths.length + 1} required outputs and homepage metadata.`);
