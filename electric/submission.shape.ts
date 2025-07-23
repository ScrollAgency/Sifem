// electric/submission.shape.ts
import { defineShape } from 'electric-sql/client'

export default defineShape('submission', [
  'id',
  'created_at',
  'updated_at',
])
