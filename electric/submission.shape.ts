import { ShapeStream, Shape } from '@electric-sql/client';

const submissionStream = new ShapeStream({
  url: 'http://localhost:5133/v1/shape',  // adapte si besoin
  params: {
    table: 'submission',
  },
});

const submissionShape = new Shape(submissionStream);

export async function getSubmissionRows() {
  return await submissionShape.rows;
}

export default submissionShape;
