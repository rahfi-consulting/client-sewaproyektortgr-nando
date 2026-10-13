import type { StructureResolver } from 'sanity/structure'

/**
 * The left hand list in the Studio.
 *
 * Site Settings is one document that always exists, so it is pinned as a single
 * entry rather than a list someone could add a second copy to. Products is an
 * ordinary list.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('product').title('Products'),
    ])
