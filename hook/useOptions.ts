import { useEffect, useState } from "react";
import optionShape from "@/electric/option.shape";

type Option = {
  id: number;
  name_fr: string;
};

export function useOptions(): { data: Option[]; loading: boolean } {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    optionShape.rows.then((rows) => {
      setOptions((rows as Option[]) ?? []);
      setLoading(false);
    });

    const unsubscribe = optionShape.subscribe(({ rows }) => {
      setOptions((rows as Option[]) ?? []);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { data: options, loading };
}
