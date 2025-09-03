import { useEffect, useState } from "react";
import { ShapeStream, Shape } from "@electric-sql/client";

type Lesion = {
  id: number;
  name_fr: string;
  category_fr?: string;
  type?: string;
  status?: string;
};

export function useLesions(): { data: Lesion[]; loading: boolean } {
  const [lesions, setLesions] = useState<Lesion[]>([]);
  const [loading, setLoading] = useState(true);

  const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";
  const url = isLocalhost
    ? "http://localhost:3006/api/proxy-electric?table=lesion&offset=-1"
    : "https://electric-sifem.agence-scroll.com/api/proxy-electric?table=lesion&offset=-1";

  useEffect(() => {
    const stream = new ShapeStream({ url });
    const shape = new Shape(stream);

    shape.rows.then((rows) => {
      const sorted = (rows as Lesion[]).sort((a, b) => a.id - b.id);
      setLesions(sorted);
      setLoading(false);
    });

    const unsubscribe = shape.subscribe(({ rows }) => {
      const sorted = (rows as Lesion[]).sort((a, b) => a.id - b.id);
      setLesions(sorted);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { data: lesions, loading };
}

