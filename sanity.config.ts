import { visionTool } from '@sanity/vision'
import { buildLegacyTheme, defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { apiVersion, dataset, projectId } from './sanity/env'
import { StudioLogo } from './sanity/logo'
import { schemaTypes } from './sanity/schemas'
import { structure } from './sanity/structure'

/**
 * The Studio in the site's own palette: a white ground with black as the one
 * accent, which is what the website is built from.
 *
 * The state colours stay at Sanity's defaults on purpose: an error has to look
 * like an error rather than another shade of black.
 */
const theme = buildLegacyTheme({
  '--black': '#0a0a0a',
  '--white': '#ffffff',
  '--gray': '#71717a',
  '--gray-base': '#71717a',
  '--component-bg': '#ffffff',
  '--component-text-color': '#0a0a0a',
  '--brand-primary': '#0a0a0a',
  '--default-button-color': '#52525b',
  '--default-button-primary-color': '#0a0a0a',
  '--focus-color': '#0a0a0a',
  '--main-navigation-color': '#ffffff',
  '--main-navigation-color--inverted': '#0a0a0a',
})

/** The one document that exists exactly once and is never created a second time. */
const SINGLETON = 'siteSettings'

export default defineConfig({
  name: 'default',
  title: 'SEWAPROYEKTOR.TGR',
  projectId,
  dataset,
  // The Studio is mounted inside the website, so the router has to be told which
  // part of the URL is not its own.
  basePath: '/studio',
  theme,
  studio: { components: { logo: StudioLogo } },
  schema: {
    types: schemaTypes,
    // Site Settings is reached through its pinned list item, so it is never
    // offered in the "create new" menu.
    templates: (templates) => templates.filter((template) => template.schemaType !== SINGLETON),
  },
  document: {
    actions: (actions, { schemaType }) =>
      schemaType === SINGLETON
        ? actions.filter(({ action }) => action !== 'duplicate' && action !== 'delete')
        : actions,
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
})
