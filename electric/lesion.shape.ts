import { ShapeStream, Shape } from '@electric-sql/client';

const lesionStream = new ShapeStream({
  url: 'http://localhost:5134/v1/shape',  // adapte si besoin (ton URL Electric)
  params: {
    table: 'lesion',
  },
});

const lesionShape = new Shape(lesionStream);

// Optionnel : fonction pour récupérer les données synchronisées dès que prêtes
export async function getLesionRows() {
  return await lesionShape.rows;
}

// Export du Shape pour s’abonner ailleurs
export default lesionShape;
