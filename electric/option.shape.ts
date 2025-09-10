import { ShapeStream, Shape } from '@electric-sql/client';

// Désactivé : connexion API ElectricSQL
export async function getOptionRows() {
  return [];
}

const optionShape = {
  rows: Promise.resolve([]),
  subscribe: () => () => {},
};
export default optionShape;
