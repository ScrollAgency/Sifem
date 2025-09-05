import { useEffect, useState } from "react";
import { ShapeStream, Shape } from "@electric-sql/client";

type Option = {
  id: number;
  name_fr: string;
};

export function useOptions(): { data: Option[]; loading: boolean } {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";
  const url = isLocalhost
    ? "http://localhost:3000/api/proxy-electric?table=option&offset=-1"
    : "https://sifem.agence-scroll.com/api/proxy-electric?table=option&offset=-1";

  useEffect(() => {
    const stream = new ShapeStream({ url });
    const shape = new Shape(stream);

    shape.rows.then((rows) => {
      setOptions(rows as Option[]);
      setLoading(false);
    });

    const unsubscribe = shape.subscribe(({ rows }) => {
      setOptions(rows as Option[]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { data: options, loading };
}
