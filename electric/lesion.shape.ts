import { ShapeStream, Shape } from '@electric-sql/client';

// Désactivé : connexion API ElectricSQL
export async function getLesionRows() {
  return [];
}

const lesionShape = {
  rows: Promise.resolve([]),
  subscribe: () => () => {},
};
export default lesionShape;
