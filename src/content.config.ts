import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const profile = defineCollection({
  loader: file('src/content/profile.yml'),
  schema: z.object({
    name: z.string(),
    shortBio: z.string(),
    location: z.string(),
    email: z.email(),
    resume: z.string(),
    hero: z.object({
      professional: z.string(),
      personal: z.string(),
    }),
    workplaces: z.array(
      z.object({
        name: z.string(),
        url: z.url(),
      }),
    ),
    social: z.array(
      z.object({
        name: z.string(),
        url: z.url(),
      }),
    ),
  }),
});

const note = z.object({
  text: z.string(),
  tone: z.enum(['yellow', 'blue', 'coral', 'green']).default('yellow'),
  placement: z.enum(['inner', 'outer', 'media']).default('inner'),
});

const location = z.object({
  label: z.string(),
  coordinates: z.tuple([z.number(), z.number()]).optional(),
});

const timeline = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/timeline' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      organization: z.string().optional(),
      role: z.string().optional(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date().optional(),
      dateLabel: z.string(),
      kind: z.enum(['work', 'education', 'project', 'travel', 'life']),
      summary: z.string(),
      details: z.array(z.string()).default([]),
      location,
      media: z.discriminatedUnion('kind', [
        z.object({
          kind: z.literal('map'),
          coordinates: z.tuple([z.number(), z.number()]),
          zoom: z.number().min(1).max(16).default(8),
          label: z.string(),
        }),
        z.object({
          kind: z.literal('image'),
          src: image(),
          alt: z.string(),
          caption: z.string().optional(),
        }),
        z.object({
          kind: z.literal('video'),
          src: z.string(),
          poster: image().optional(),
          caption: z.string().optional(),
        }),
        z.object({
          kind: z.literal('route'),
          coordinates: z.array(z.tuple([z.number(), z.number()])).min(2),
          label: z.string(),
        }),
      ]),
      notes: z.array(note).default([]),
      links: z
        .array(
          z.object({
            label: z.string(),
            url: z.url(),
          }),
        )
        .default([]),
      featured: z.boolean().default(true),
      draft: z.boolean().default(false),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/projects' }),
  schema: z.object({
    date: z.string(),
    title: z.string(),
    github: z.string().optional().default(''),
    external: z.string().optional().default(''),
    ios: z.string().optional().default(''),
    android: z.string().optional().default(''),
    tech: z.array(z.string()).default([]),
    company: z.string().optional().default(''),
    showInProjects: z.boolean().default(true),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    slug: z.string(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { profile, projects, timeline, writing };