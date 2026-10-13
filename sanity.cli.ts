import { defineCliConfig } from 'sanity/cli'
import { dataset, projectId } from './sanity/env'

/**
 * Configuration for the `sanity` command line tool, which is a separate file
 * from sanity.config.ts: that one describes the Studio, this one tells the CLI
 * which project to talk to for `dataset`, `cors` and the import scripts.
 *
 * The ids are read from the environment rather than written here, so the one
 * place they are configured stays the .env file.
 */
export default defineCliConfig({
  api: { projectId, dataset },
  autoUpdates: false,
})
