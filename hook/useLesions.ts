import { useEffect, useState } from "react";
import { ShapeStream, Shape } from "@electric-sql/client";

type Lesion = {
  id: number;
  name_fr: string;
  category_fr?: string;
  type?: string;
  status?: string;
};

export function useLesions(): Lesion[] {
  const [lesions, setLesions] = useState<Lesion[]>([]);

  useEffect(() => {
    const stream = new ShapeStream({
      url: "http://localhost:3007/api/proxy-electric?table=lesion&offset=-1",
      params: { table: "lesion" },
    });

    const shape = new Shape(stream);

    shape.rows.then((rows) => setLesions(rows as Lesion[]));

    const unsubscribe = shape.subscribe(({ rows }) => {
      setLesions(rows as Lesion[]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return lesions;
}
