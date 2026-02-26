import {defineBlueprint, defineDocumentFunction} from '@sanity/blueprints'
import 'dotenv/config'
import process from 'node:process'

const {ALGOLIA_APP_ID, ALGOLIA_WRITE_KEY, ALGOLIA_ENABLE_AUTO_SYNC} = process.env

if (typeof ALGOLIA_APP_ID !== 'string' || typeof ALGOLIA_WRITE_KEY !== 'string') {
  throw new Error('ALGOLIA_APP_ID and ALGOLIA_WRITE_KEY must be set')
}

export default defineBlueprint({
  resources: [
    defineDocumentFunction({
      name: 'algolia-document-sync',
      memory: 1,
      timeout: 10,
      src: './functions/algolia-document-sync',
      event: {
        on: ['create', 'update', 'delete'],
        filter: "_type in ['painting', 'project', 'recipe']",
        // Note: Sanity Functions 'projection' can't fully join references via -> automatically like standard querying.
        // It fetches references but the user said they are okay with mapping primarily via the manual script 
        // to handle the joined data until they enable auto-sync later.
        projection: "{_id, _type, title, name, description, slug, hideFromSearch, 'operation': delta::operation()}",
      },
      env: {
        ALGOLIA_APP_ID,
        ALGOLIA_WRITE_KEY,
        ALGOLIA_ENABLE_AUTO_SYNC: ALGOLIA_ENABLE_AUTO_SYNC || 'false'
      },
    }),
  ],
})
