/**
 * Which Sanity project the site and the Studio talk to.
 *
 * Both values are public: the dataset is readable without a key, which is what
 * lets the catalogue render for a visitor. Writing requires a Sanity login, and
 * that is the only credential involved anywhere in this project.
 */

export const apiVersion = '2026-10-01'

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''

/**
 * False before the project is configured, so a page can render its empty state
 * instead of throwing. The Studio route refuses to load without it, because an
 * editor with no project has nothing to edit and should be told why.
 */
export const isSanityConfigured = Boolean(projectId)

export function requireProjectId(): string {
  if (!projectId) {
    throw new Error(
      'NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Copy .env.example to .env and fill it in.',
    )
  }

  return projectId
}
