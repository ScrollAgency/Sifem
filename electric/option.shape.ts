import { ShapeStream, Shape } from '@electric-sql/client';

const optionStream = new ShapeStream({
  url: 'http://localhost:5133/v1/shape',  // adapte si besoin
  params: {
    table: 'option',
  },
});

const optionShape = new Shape(optionStream);

export async function getOptionRows() {
  return await optionShape.rows;
}

export default optionShape;
