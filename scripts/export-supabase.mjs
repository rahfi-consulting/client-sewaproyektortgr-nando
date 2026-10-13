/**
 * Take everything out of Supabase before it is switched off.
 *
 *   node --env-file=.env scripts/export-supabase.mjs
 *
 * Writes export/products.json and downloads every product image into
 * export/images/, so the catalogue survives the database and can be loaded into
 * Sanity by scripts/import-sanity.mjs.
 *
 * The anonymous key can only read products whose status is true, which is what
 * the website shows. Set SUPABASE_SERVICE_ROLE_KEY in .env as well to export the
 * disabled ones too; the script says which key it used.
 *
 * Nothing printed here contains a URL, a key or a project reference.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const OUT = 'export'
const IMAGES = join(OUT, 'images')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const key = serviceKey ?? anonKey

if (!url || !key) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then run:')
  console.error('  node --env-file=.env scripts/export-supabase.mjs')
  process.exit(1)
}

/** A file name from a product name: lower case, words joined by dashes. */
const slug = (value) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'product'

const EXTENSIONS = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/avif': '.avif',
  'image/gif': '.gif',
}

const columns = 'id,name,description,price,image_url,status,category,featured,sort_order,created_at,updated_at'
const response = await fetch(`${url}/rest/v1/products?select=${columns}&order=sort_order.asc`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
})

if (!response.ok) {
  console.error(`Supabase answered ${response.status}. Nothing was written.`)
  process.exit(1)
}

const products = await response.json()
mkdirSync(IMAGES, { recursive: true })

const hosts = new Map()
const downloads = []
const failures = []
const taken = new Set()

for (const [index, product] of products.entries()) {
  const source = product.image_url?.trim()
  if (!source) continue

  let host
  try {
    host = new URL(source).hostname
  } catch {
    failures.push(`${product.name}: image_url is not a URL`)
    continue
  }
  hosts.set(host, (hosts.get(host) ?? 0) + 1)

  try {
    const image = await fetch(source)
    if (!image.ok) {
      failures.push(`${product.name}: image answered ${image.status}`)
      continue
    }
    const bytes = Buffer.from(await image.arrayBuffer())
    const extension = EXTENSIONS[(image.headers.get('content-type') ?? '').split(';')[0]] ?? '.jpg'

    // The product name is not unique on its own, so the row's position keeps the
    // file names apart and keeps them in catalogue order.
    let file = `${String(index + 1).padStart(3, '0')}-${slug(product.name)}${extension}`
    while (taken.has(file)) file = `x-${file}`
    taken.add(file)

    writeFileSync(join(IMAGES, file), bytes)
    downloads.push({ id: product.id, name: product.name, file, bytes: bytes.length })
  } catch (error) {
    failures.push(`${product.name}: ${error.message}`)
  }
}

writeFileSync(
  join(OUT, 'products.json'),
  JSON.stringify({ exportedAt: new Date().toISOString(), products, images: downloads }, null, 2),
)

console.log(`Read with the ${serviceKey ? 'service role' : 'anonymous'} key.`)
console.log(`${products.length} products written to ${OUT}/products.json.`)
console.log(`${downloads.length} images downloaded to ${IMAGES}/.`)
console.log(`Image hosts: ${[...hosts].map(([host, count]) => `${host} (${count})`).join(', ') || 'none'}`)
if (failures.length > 0) console.log(`Could not download ${failures.length}:\n  ${failures.join('\n  ')}`)
