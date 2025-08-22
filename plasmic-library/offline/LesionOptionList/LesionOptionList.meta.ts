const LesionOptionListMeta = {
  name: "LesionOptionList",
  section: "1- Offline",
  displayName: "Lesion Option List",
  description: "Liste les lésions et options via hooks JAM (utilisation en slot uniquement)",
  importPath: "@plasmic-library/offline/LesionOptionList/LesionOptionList",
  thumbnailUrl: "https://static1.plasmic.app/insertables/dataSource.svg",

  props: {
    matchFilters: {
      type: "choice",
      displayName: "Match Filters",
      options: ["all", "any"],
      defaultValue: "all",
      description:
        "Détermine si tous les filtres doivent correspondre ('all') ou au moins un ('any')",
    },
    filterColumn1: {
      type: "choice",
      displayName: "1.Filtre Colonne",
      options: ["id", "name_fr", "category_fr", "type", "status"],
    },
    filterOperator1: {
      type: "choice",
      displayName: "Opérateur",
      options: ["contains", "not contains", "is", "is not"],
    },
    filterValue1: {
      type: "string",
      displayName: "Valeur ",
    },

    filterColumn2: {
      type: "choice",
      displayName: "2.Filtre Colonne",
      options: ["id", "name_fr", "category_fr", "type", "status"],
    },
    filterOperator2: {
      type: "choice",
      displayName: "Opérateur",
      options: ["contains", "not contains", "is", "is not"],
    },
    filterValue2: {
      type: "string",
      displayName: "Valeur",
    },

    sortBy: {
      type: "choice",
      displayName: "Trier par",
      options: ["id", "name_fr", "category_fr", "type", "status"],
    },
    order: {
      type: "choice",
      displayName: "Ordre de tri",
      options: ["asc", "desc"],
      defaultValue: "asc",
    },

    children: "slot",
  },
};

export default LesionOptionListMeta;
