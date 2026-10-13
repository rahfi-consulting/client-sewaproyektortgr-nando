import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Everything about the business that is not a product: the name it trades under,
 * how to reach it, the logos, and the two photographs the home and About pages
 * are built around.
 *
 * One document, edited in one place, so a new phone number or a new logo takes
 * effect without a deploy.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Every field in view at once. Nothing is folded away behind a tab or a
  // collapsed heading, so an editor can see what there is to change.
  groups: [
    { name: 'brand', title: 'Logo And Images' },
    { name: 'identity', title: 'Name And Copy' },
    { name: 'contact', title: 'Contact' },
  ],
  fields: [
    defineField({
      name: 'darkLogo',
      title: 'Logo For A Light Background',
      type: 'image',
      group: 'brand',
      description:
        'The dark version of the logo, used in the header and on the white pages. PNG with a transparent background.',
    }),
    defineField({
      name: 'lightLogo',
      title: 'Logo For A Dark Background',
      type: 'image',
      group: 'brand',
      description:
        'The light version, used in the black footer and as the browser tab icon. PNG with a transparent background.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Home Page Photograph',
      type: 'image',
      options: { hotspot: true },
      group: 'brand',
    }),
    defineField({
      name: 'aboutImage',
      title: 'About Page Photograph',
      type: 'image',
      options: { hotspot: true },
      group: 'brand',
    }),

    defineField({
      name: 'siteName',
      title: 'Business Name',
      type: 'string',
      group: 'identity',
      initialValue: 'SEWAPROYEKTOR.TGR',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'identity',
      description: 'The large line at the top of the home page.',
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      group: 'identity',
      description: 'The paragraph under the tagline, also used as the search result summary.',
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: 'features',
      title: 'Selling Points',
      type: 'array',
      group: 'identity',
      description: 'The four short promises in the strip under the home page hero. Drag to reorder.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            { name: 'title', type: 'string', validation: (rule) => rule.required() },
            { name: 'description', type: 'string', validation: (rule) => rule.required() },
          ],
          preview: { select: { title: 'title', subtitle: 'description' } },
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: 'aboutBody',
      title: 'About Page Copy',
      type: 'array',
      group: 'identity',
      description: 'One entry per paragraph on the About page.',
      of: [defineArrayMember({ type: 'text', rows: 4 })],
    }),

    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Number',
      type: 'string',
      group: 'contact',
      description:
        'Country code and number, digits only: no plus, no spaces, no leading zero. 0812 3456 7890 is written 6281234567890.',
      validation: (rule) =>
        rule
          .required()
          .regex(/^[1-9][0-9]{7,14}$/, { name: 'digits only, starting with the country code' })
          .error('Digits only, starting with the country code. No plus sign, spaces or leading zero.'),
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
      group: 'contact',
      description: 'Shown on the About page, written the way it should read.',
    }),
    defineField({
      name: 'email',
      title: 'E-Mail Address',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'address',
      title: 'Location',
      type: 'string',
      group: 'contact',
      description: 'The service area, for example Tangerang, Banten.',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram Handle',
      type: 'string',
      group: 'contact',
      description: 'Without the @, for example sewaproyektor.tgr. The link is built from it.',
    }),
    defineField({
      name: 'tiktok',
      title: 'TikTok Handle',
      type: 'string',
      group: 'contact',
      description: 'Without the @, for example sewaproyektor.tgr. The link is built from it.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Site Settings' }) },
})
