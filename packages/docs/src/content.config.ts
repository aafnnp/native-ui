import { defineCollection, z } from "astro:content";

/**
 * 文档内容集合定义
 */
const docsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = {
  docs: docsCollection,
};
