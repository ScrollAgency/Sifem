import { useEffect, useState } from "react";
// Utiliser fetch pour charger le JSON depuis public/

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
    async function loadLesions() {
      try {
        const res = await fetch('/lesions.json');
        const data = await res.json();
        setLesions(Array.isArray(data) ? data : []);
      } catch (e) {
        setLesions([]);
      } finally {
        setLoading(false);
      }
    }
    loadLesions();
  }, []);

  return { data: lesions, loading };
}