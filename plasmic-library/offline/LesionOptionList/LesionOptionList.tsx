import React from "react";
import { useLesions } from "@/hook/useLesions";
import { useOptions } from "@/hook/useOptions";
import { LesionOptionProvider } from "@/contexts/LesionOptionContext";

type Lesion = {
  id: number;
  name_fr: string;
  category_fr?: string;
  type?: string;
  status?: string;
};
type Option = { id: number; name_fr: string };
type MatchFilters = "all" | "any";

type FilterOperator = "contains" | "not contains" | "is" | "is not";

function doesFilterMatch(
  lesion: Lesion,
  column: keyof Lesion,
  operator: FilterOperator,
  value: string
): boolean {
  const lesionVal = lesion[column];
  if (typeof lesionVal !== "string") return false;

  switch (operator) {
    case "contains":
      return lesionVal.includes(value);
    case "not contains":
      return !lesionVal.includes(value);
    case "is":
      return lesionVal === value;
    case "is not":
      return lesionVal !== value;
    default:
      return false;
  }
}

export const LesionOptionList: React.FC<{
  lesions?: Lesion[] | { data: Lesion[]; loading: boolean };
  options?: Option[] | { data: Option[]; loading: boolean };
  children?: React.ReactNode;

  matchFilters?: MatchFilters;

  filterColumn1?: keyof Lesion;
  filterOperator1?: FilterOperator;
  filterValue1?: string;

  filterColumn2?: keyof Lesion;
  filterOperator2?: FilterOperator;
  filterValue2?: string;

  sortBy?: keyof Lesion;
  order?: "asc" | "desc";

  visibilityCondition?: (lesions: Lesion[], options: Option[]) => boolean;
}> = ({
  lesions,
  options,
  children,
  matchFilters = "all",
  filterColumn1,
  filterOperator1,
  filterValue1,
  filterColumn2,
  filterOperator2,
  filterValue2,
  sortBy,
  order = "asc",
  visibilityCondition,
}) => {
  // Hooks fetch
  const { data: fetchedLesions, loading: loadingLesions } = useLesions();
  const { data: fetchedOptions, loading: loadingOptions } = useOptions();

  // Extract lesions data and loading state from props or fallback
  const lesionsData = Array.isArray(lesions)
    ? lesions
    : lesions?.data ?? [];
  const optionsData = Array.isArray(options)
    ? options
    : options?.data ?? [];

  const isLoading = loadingLesions || loadingOptions || (lesions && 'loading' in lesions && lesions.loading) || (options && 'loading' in options && options.loading);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  // Prioritize lesions & options props if provided, else fetched data
  let finalLesions = lesionsData.length > 0 ? lesionsData : fetchedLesions;
  const finalOptions = optionsData.length > 0 ? optionsData : fetchedOptions;

  // Construire un tableau des filtres valides
  const filters = [
    filterColumn1 && filterOperator1 && filterValue1
      ? { column: filterColumn1, operator: filterOperator1, value: filterValue1 }
      : null,
    filterColumn2 && filterOperator2 && filterValue2
      ? { column: filterColumn2, operator: filterOperator2, value: filterValue2 }
      : null,
  ].filter(Boolean) as { column: keyof Lesion; operator: FilterOperator; value: string }[];

  if (filters.length > 0) {
    finalLesions = finalLesions.filter((lesion) => {
      const results = filters.map(({ column, operator, value }) =>
        doesFilterMatch(lesion, column, operator, value)
      );
      return matchFilters === "all" ? results.every(Boolean) : results.some(Boolean);
    });
  }

  // Trier si demandé
  if (sortBy) {
    finalLesions = [...finalLesions].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return order === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return order === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }

  const isVisible = visibilityCondition
    ? visibilityCondition(finalLesions, finalOptions)
    : true;

  if (!isVisible) return null;

  return (
    <LesionOptionProvider lesions={finalLesions} options={finalOptions}>
      {children}
    </LesionOptionProvider>
  );
};

export default LesionOptionList;
