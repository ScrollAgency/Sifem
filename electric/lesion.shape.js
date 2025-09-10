"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// electric/lesion.shape.ts
const { ShapeStream, Shape } = require("@electric-sql/client");

const lesionStream = new ShapeStream({
    url: 'http://localhost:5133/v1/shape',
    params: { table: 'lesion' },
});

const lesionShape = new Shape(lesionStream);

exports.getLesionRows = async function() {
    return await lesionShape.rows;
};

exports.default = lesionShape;
