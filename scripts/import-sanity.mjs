/**
 * Load the catalogue into Sanity, pictures and all.
 *
 *   node --env-file=.env scripts/import-sanity.mjs            report only
 *   APPLY=1 node --env-file=.env scripts/import-sanity.mjs    write
 *
 * Reads scripts/catalog.json, downloads each photograph from wherever it is
 * hosted today, and uploads the file itself into Sanity. After this runs, the
 * site reads nothing from Cloudinary or anywhere else: every image is a Sanity
 * asset, and the old hosting can be emptied.
 *
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID and a SANITY_WRITE_TOKEN with write access,
 * created at sanity.io/manage under API, Tokens.
 *
 * Document ids are built from the product name, so the Supabase ids are not
 * carried over and a second run recognises what it already wrote. Nothing is
 * deleted and nothing is overwritten: a product or a settings document that is
 * already in Sanity is left exactly as it is.
 */
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { basename } from 'node:path'
import { createClient } from '@sanity/client'

const CATALOG = 'scripts/catalog.json'
const APPLY = process.env.APPLY === '1'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const token = process.env.SANITY_WRITE_TOKEN

/** The static files the site shipped with, which become the first logos and photographs. */
const SITE_FILES = {
  darkLogo: 'public/dark-logo.png',
  lightLogo: 'public/light-logo.png',
  heroImage: 'public/home-image.jpeg',
  aboutImage: 'public/about-image.jpeg',
}

/**
 * What the site said about itself in code, now content.
 *
 * The two numbers come from the environment the site was deployed with, so the
 * values move into Sanity without being written down anywhere else.
 */
const SETTINGS = {
  siteName: 'SEWAPROYEKTOR.TGR',
  tagline: 'Pusat Sewa Proyektor Tangerang Terbaik & Terpercaya!',
  description:
    'Layanan sewa proyektor, layar, audio, dan perlengkapan event lain mulai dari 3 jam dengan harga jelas dengan respons cepat untuk area Tangerang dan sekitarnya.',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? process.env.NEXT_PUBLIC_PHONE_NUMBER ?? '',
  phoneNumber: process.env.NEXT_PUBLIC_PHONE_NUMBER ?? '',
  email: 'halo@sewaproyektor.tgr',
  address: 'Tangerang, Banten',
  instagram: 'sewaproyektor.tgr',
  tiktok: 'sewaproyektor.tgr',
  features: [
    { _key: 'f1', title: 'Fast Shipping', description: 'Pengiriman cepat untuk area layanan Tangerang.' },
    { _key: 'f2', title: 'Simple Form', description: 'Isi data diri dan validasi lokasi yang cepat dan mudah' },
    { _key: 'f3', title: 'Secured Payments', description: 'Harga transparan dan proses transaksi jelas.' },
    { _key: 'f4', title: 'Call us Anytime', description: 'Konsultasi kebutuhan event dan presentasi kapan saja.' },
  ],
  aboutBody: [
    'berfokus pada layanan sewa proyektor dan perlengkapan event yang rapi, cepat, dan mudah dikoordinasikan. Kami melayani kebutuhan presentasi kantor, seminar, nobar, ibadah, hingga event komunitas di area Tangerang dan sekitarnya.',
    'Misi kami sederhana: membantu klien menjalankan acara tanpa hambatan teknis. Itu berarti harga jelas, pilihan perlengkapan relevan, komunikasi responsif, dan setup yang stabil sejak awal.',
    'Kami menjaga setiap penyewaan tetap praktis, dari konsultasi alat, pengantaran, hingga pengambilan kembali setelah acara selesai.',
  ],
}

if (!projectId) {
  console.error('Set NEXT_PUBLIC_SANITY_PROJECT_ID in .env first.')
  process.exit(1)
}
if (APPLY && !token) {
  console.error('Writing needs SANITY_WRITE_TOKEN in .env. Create one at sanity.io/manage.')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2026-10-01', token, useCdn: false })

/** A document id from a product name, so a second run recognises what it wrote. */
const slug = (value) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'product'

/** Uploaded once per address: three cable products share one photograph. */
const uploaded = new Map()

async function uploadFromUrl(url, label) {
  if (uploaded.has(url)) return uploaded.get(url)

  const response = await fetch(url)
  if (!response.ok) throw new Error(`${label}: the image answered ${response.status}`)
  const bytes = Buffer.from(await response.arrayBuffer())

  const filename = basename(new URL(url).pathname) || `${slug(label)}.jpg`
  const asset = await client.assets.upload('image', bytes, { filename })
  const reference = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }

  uploaded.set(url, reference)
  console.log(`  uploaded ${label} (${(bytes.length / 1024).toFixed(0)}KB)`)
  return reference
}

async function uploadFromFile(path, label) {
  const bytes = await readFile(path)
  const asset = await client.assets.upload('image', bytes, { filename: basename(path) })
  console.log(`  uploaded ${label} (${(bytes.length / 1024).toFixed(0)}KB)`)
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

const catalog = JSON.parse(await readFile(CATALOG, 'utf8'))
const existing = await client.fetch('*[_type in ["product", "siteSettings"]]._id')
const existingIds = new Set(existing)

const toCreate = []
for (const product of catalog) {
  const id = `product-${slug(product.name)}`
  if (existingIds.has(id)) {
    console.log(`  = ${product.name} is already in Sanity`)
    continue
  }
  existingIds.add(id)
  toCreate.push({ id, product })
}

const hasSettings = existingIds.has('siteSettings')
const hosts = new Set(catalog.map((product) => new URL(product.image_url).hostname))

console.log(`${toCreate.length} products to create, ${catalog.length - toCreate.length} already there.`)
console.log(`Images will be pulled from: ${[...hosts].join(', ')}`)
console.log(hasSettings ? 'Site Settings already exists and is left alone.' : 'Site Settings will be created.')
console.log(
  `Contact details to write: WhatsApp ${SETTINGS.whatsappNumber ? 'set' : 'MISSING'}, phone ${SETTINGS.phoneNumber ? 'set' : 'MISSING'}, ` +
    `Instagram @${SETTINGS.instagram}, TikTok @${SETTINGS.tiktok}, address ${SETTINGS.address}.`,
)

if (!APPLY) {
  console.log('\nReport only. Nothing was written. Run again with APPLY=1 to upload.')
  process.exit(0)
}

if (!hasSettings) {
  console.log('\nSite Settings:')
  const assets = {}
  for (const [field, path] of Object.entries(SITE_FILES)) {
    if (existsSync(path)) assets[field] = await uploadFromFile(path, field)
  }
  await client.createIfNotExists({ _id: 'siteSettings', _type: 'siteSettings', ...SETTINGS, ...assets })
  console.log('  settings document written')
}

console.log('\nProducts:')
const failures = []
for (const { id, product } of toCreate) {
  const document = {
    _id: id,
    _type: 'product',
    name: product.name,
    slug: { _type: 'slug', current: slug(product.name) },
    price: product.price,
    description: product.description ?? '',
    category: product.category?.trim() || 'General',
    featured: Boolean(product.featured),
    available: product.status !== false,
    sortOrder: product.sort_order ?? 0,
  }

  try {
    if (product.image_url) document.image = await uploadFromUrl(product.image_url, product.name)
  } catch (error) {
    // A photograph that cannot be fetched is not a reason to lose the product:
    // the document is created without it and the name is reported for a reupload
    // by hand in Studio.
    failures.push(`${product.name}: ${error.message}`)
  }

  await client.createIfNotExists(document)
  console.log(`  + ${product.name}`)
}

console.log(`\nDone. ${toCreate.length} products written, ${uploaded.size} images uploaded.`)
if (failures.length > 0) {
  console.log(`Could not fetch ${failures.length} image(s), upload these in Studio:\n  ${failures.join('\n  ')}`)
}
