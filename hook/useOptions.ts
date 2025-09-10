import { useEffect, useState } from "react";
// Utiliser fetch pour charger le JSON depuis public/

type Option = {
  id: number;
  name_fr: string;
};

export function useOptions(): { data: Option[]; loading: boolean } {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOptions() {
      try {
        const res = await fetch('/options.json');
        const data = await res.json();
        setOptions(Array.isArray(data) ? data : []);
      } catch (e) {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }
    loadOptions();
  }, []);

  return { data: options, loading };
}
