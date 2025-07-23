import { useEffect, useState } from "react";
import { ShapeStream, Shape } from "@electric-sql/client";

type Option = {
  id: number;
  name_fr: string;
};

export function useOptions() {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const stream = new ShapeStream({
      url: "http://localhost:5133/v1/shape",
      params: { table: "option" },  // <-- adapter le nom de la table ici
    });

    const shape = new Shape(stream);

    shape.rows.then(rows => setOptions(rows as Option[]));

    const unsubscribe = shape.subscribe(({ rows }) => {
      setOptions(rows as Option[]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return options;
}
