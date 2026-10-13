/**
 * Load the Supabase export into Sanity: the catalogue, its images, and the
 * contact details the site used to carry in code and in the environment.
 *
 *   node --env-file=.env scripts/import-sanity.mjs            report only
 *   APPLY=1 node --env-file=.env scripts/import-sanity.mjs    write
 *
 * Run scripts/export-supabase.mjs first; this reads export/products.json and the
 * images beside it.
 *
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID and a SANITY_WRITE_TOKEN with write access,
 * created at sanity.io/manage under API, Tokens.
 *
 * Nothing is deleted and nothing is overwritten: a product or a settings field
 * that already exists in Sanity is left exactly as it is, so the script can be
 * run twice without undoing an edit made in Studio.
 */
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { basename, join } from 'node:path'
import { createClient } from '@sanity/client'

const EXPORT = 'export/products.json'
const IMAGES = 'export/images'
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
if (!existsSync(EXPORT)) {
  console.error(`${EXPORT} is missing. Run: node --env-file=.env scripts/export-supabase.mjs`)
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

async function uploadImage(path, label) {
  const bytes = await readFile(path)
  const asset = await client.assets.upload('image', bytes, { filename: basename(path) })
  console.log(`  uploaded ${label} (${(bytes.length / 1024).toFixed(0)}KB)`)
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

const { products, images } = JSON.parse(await readFile(EXPORT, 'utf8'))
const imageByProductId = new Map(images.map((image) => [image.id, image.file]))

const existing = await client.fetch(
  '*[_type in ["product", "siteSettings"]]{_id, _type}',
)
const existingIds = new Set(existing.map((document) => document._id))

const toCreate = []
for (const [index, product] of products.entries()) {
  const id = `product-${slug(product.name)}`
  if (existingIds.has(id)) {
    console.log(`  = ${product.name} is already in Sanity`)
    continue
  }
  existingIds.add(id)
  toCreate.push({ id, product, index, file: imageByProductId.get(product.id) })
}

const hasSettings = existingIds.has('siteSettings')

console.log(`${toCreate.length} products to create, ${products.length - toCreate.length} already there.`)
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
    if (existsSync(path)) assets[field] = await uploadImage(path, field)
  }
  await client.createIfNotExists({
    _id: 'siteSettings',
    _type: 'siteSettings',
    ...SETTINGS,
    ...assets,
  })
  console.log('  settings document written')
}

console.log('\nProducts:')
for (const { id, product, index, file } of toCreate) {
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
    sortOrder: product.sort_order ?? index,
  }

  if (file && existsSync(join(IMAGES, file))) {
    document.image = await uploadImage(join(IMAGES, file), product.name)
  }

  await client.createIfNotExists(document)
  console.log(`  + ${product.name}`)
}

console.log(`\nDone. ${toCreate.length} products and ${hasSettings ? 'no' : 'one'} settings document written.`)
