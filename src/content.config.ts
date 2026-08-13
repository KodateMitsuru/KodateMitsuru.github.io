import type { CollectionConfig } from 'astro/content/config'
import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

type PostData = {
  title: string
  published: Date
  updated?: Date
  draft: boolean
  description: string
  image: string
  tags: string[]
  category: string
  lang: string
  prevTitle: string
  prevSlug: string
  nextTitle: string
  nextSlug: string
}

const postsSchema: z.ZodType<PostData> = z.object({
  title: z.string(),
  published: z.date(),
  updated: z.date().optional(),
  draft: z.boolean().optional().default(false),
  description: z.string().optional().default(''),
  image: z.string().optional().default(''),
  tags: z.array(z.string()).optional().default([]),
  category: z.string().optional().default(''),
  lang: z.string().optional().default(''),

  /* For internal use */
  prevTitle: z.string().default(''),
  prevSlug: z.string().default(''),
  nextTitle: z.string().default(''),
  nextSlug: z.string().default(''),
})

const specSchema: z.ZodType<object> = z.object({})

const postsCollection: CollectionConfig<typeof postsSchema> = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: postsSchema,
})

const specCollection: CollectionConfig<typeof specSchema> = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/spec' }),
  schema: specSchema,
})

export const collections: {
  posts: CollectionConfig<typeof postsSchema>
  spec: CollectionConfig<typeof specSchema>
} = {
  posts: postsCollection,
  spec: specCollection,
}
