import { useEffect, useState } from "react";
import lesionShape from "@/electric/lesion.shape";

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

  useEffect(() => {
    lesionShape.rows.then((rows) => {
      setLesions((rows as Lesion[]) ?? []);
      setLoading(false);
    });

    const unsubscribe = lesionShape.subscribe(({ rows }) => {
      setLesions((rows as Lesion[]) ?? []);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { data: lesions, loading };
}