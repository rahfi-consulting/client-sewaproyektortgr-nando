/**
 * Every GROQ query the site runs, in one file so the shape of what is read is
 * visible in one place.
 */

const PRODUCT_FIELDS = `
  "id": _id,
  name,
  description,
  price,
  category,
  "imageUrl": image.asset->url,
  "status": coalesce(available, true),
  "featured": coalesce(featured, false),
  "sortOrder": coalesce(sortOrder, 999)
`

/** The catalogue, in the order an editor arranged it. */
export const PRODUCTS_QUERY = `*[_type == "product" && coalesce(available, true) == true]
  | order(sortOrder asc, name asc){${PRODUCT_FIELDS}}`

/** The same list including the products switched off, for nothing public. */
export const ALL_PRODUCTS_QUERY = `*[_type == "product"]
  | order(sortOrder asc, name asc){${PRODUCT_FIELDS}}`

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  siteName,
  tagline,
  description,
  whatsappNumber,
  phoneNumber,
  email,
  address,
  instagram,
  tiktok,
  "darkLogo": darkLogo.asset->url,
  "lightLogo": lightLogo.asset->url,
  "heroImage": heroImage.asset->url,
  "aboutImage": aboutImage.asset->url,
  features[]{title, description},
  aboutBody
}`
