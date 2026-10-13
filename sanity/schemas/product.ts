import { defineField, defineType } from 'sanity'

/**
 * One rentable item in the catalogue.
 *
 * The price is a string rather than a number because the catalogue quotes a rate
 * and its duration together, as in "Rp. 450.000 / 3-4 Jam", and that line is what
 * a customer reads before messaging on WhatsApp.
 */
export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      description: 'A stable identifier for this product. Generated from the name.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Shown on the product card. Upload the highest quality version; it is resized on delivery.',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'Written exactly as it should read, for example "Rp. 450.000 / 3-4 Jam".',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.max(2000),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Groups the product in the catalogue filter, for example Proyektor or Layar.',
      initialValue: 'General',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'featured',
      title: 'Show On The Home Page',
      type: 'boolean',
      description: 'Featured products fill the carousel on the home page, up to six.',
      initialValue: false,
    }),
    defineField({
      name: 'available',
      title: 'Available To Rent',
      type: 'boolean',
      description: 'Turn off to hide the product from the website without deleting it.',
      initialValue: true,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first.',
      initialValue: 0,
      validation: (rule) => rule.integer().min(0).max(10000),
    }),
  ],
  orderings: [
    { name: 'sortOrder', title: 'Catalogue Order', by: [{ field: 'sortOrder', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', subtitle: 'price', media: 'image' },
  },
})
