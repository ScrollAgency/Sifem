CREATE TABLE lesion (
  id SERIAL PRIMARY KEY,
  name_fr TEXT,
  name_en TEXT,
  category_fr TEXT,
  category_en TEXT,
  image_fr TEXT,
  video_fr TEXT,
  macro_category_fr TEXT,
  multi_step BOOLEAN,
  next_step TEXT,
  previous_step TEXT,
  image_en TEXT,
  video_en TEXT,
  image_trauma TEXT,
  face TEXT,
  has_options BOOLEAN DEFAULT FALSE
);

CREATE TABLE Option (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT now(),
  name_fr TEXT,
  name_en TEXT,
  lesion_id INTEGER REFERENCES lesion(id) ON UPDATE CASCADE ON DELETE CASCADE,
  image_trauma TEXT,
  face TEXT
);

CREATE TABLE submission (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP
);
