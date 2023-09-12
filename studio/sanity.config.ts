import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import {documentInternationalization} from '@sanity/document-internationalization'
import {media} from 'sanity-plugin-media'

export default defineConfig({
  name: 'default',
  title: 'quebra.co',

  projectId: 'pascyiuj',
  dataset: 'production',

  plugins: [
    deskTool(),
    visionTool(),
    media(),
    documentInternationalization({
      // Required configuration
      supportedLanguages: [{id: 'fr', title: 'French'}],
      schemaTypes: ['post'],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
