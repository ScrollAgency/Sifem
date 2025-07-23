// electric/option.shape.ts
import { defineShape } from 'electric-sql/client'

export default defineShape('option', [
  'id',
  'created_at',
  'name_fr',
  'name_en',
  'lesion_id',
  'image_trauma',
  'face',
])
