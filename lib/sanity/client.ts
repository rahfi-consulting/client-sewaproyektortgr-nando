import { createClient, type SanityClient } from 'next-sanity'
import { apiVersion, dataset, isSanityConfigured, projectId } from '@/sanity/env'

/**
 * Read access to the content.
 *
 * Null until a project is configured, so the site builds and renders its empty
 * states before Sanity exists rather than failing at import time. Every caller
 * treats null as "no content yet".
 *
 * `useCdn` points reads at Sanity's cached endpoint, which is what a public
 * catalogue wants: the pages are regenerated on a timer, not per request.
 */
export const sanityClient: SanityClient | null = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: 'published' })
  : null

/** How long a page may serve content from before Sanity is asked again. */
export const REVALIDATE_SECONDS = 60

/**
 * Run a query, or fall back when there is no project or Sanity cannot be reached.
 *
 * A catalogue that fails to load should leave the rest of the page standing, so
 * a failure returns the fallback instead of taking the route down with it.
 */
export async function sanityFetch<T>(query: string, fallback: T, params: Record<string, unknown> = {}): Promise<T> {
  if (!sanityClient) return fallback

  try {
    return await sanityClient.fetch<T>(query, params, {
      next: { revalidate: REVALIDATE_SECONDS },
    })
  } catch {
    return fallback
  }
}
