/**
 * Sanity image addresses.
 *
 * The asset CDN resizes and re-encodes on request, so the original is uploaded
 * untouched and the width is asked for at the point of use. `auto=format` lets
 * the CDN answer with AVIF or WebP when the browser accepts them.
 *
 * Every address here comes out of the CMS, so it is checked before it reaches an
 * `src`: anything that is not an https URL on Sanity's CDN is dropped, and the
 * caller shows its empty state instead.
 */

const CDN_HOST = 'cdn.sanity.io'

export function imageUrl(source: string | undefined | null, width: number): string {
  if (!source) return ''

  let url: URL
  try {
    url = new URL(source)
  } catch {
    return ''
  }

  if (url.protocol !== 'https:' || url.hostname !== CDN_HOST) return ''

  url.searchParams.set('w', String(Math.round(width)))
  url.searchParams.set('q', '75')
  url.searchParams.set('auto', 'format')
  url.searchParams.set('fit', 'max')

  return url.toString()
}
