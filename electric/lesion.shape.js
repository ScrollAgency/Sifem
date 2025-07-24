"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// electric/lesion.shape.ts
var client_1 = require("electric-sql/client");
exports.default = (0, client_1.defineShape)('lesion', [
    'id',
    'name_fr',
    'name_en',
    'category_fr',
    'category_en',
    'image_fr',
    'video_fr',
    'macro_category_fr',
    'multi_step',
    'next_step',
    'previous_step',
    'image_en',
    'video_en',
    'image_trauma',
    'face',
    'has_options',
]);
