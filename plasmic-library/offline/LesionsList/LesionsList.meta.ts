const LesionsListMeta = {
  name: "LesionsList",
  section: "1- Offline",
  displayName: "Liste des lésions",
  description: "Liste les lésions via le contexte",
  importPath: "@plasmic-library/offline/LesionsList/LesionsList",
  thumbnailUrl: "https://plasmic-api.agence-scroll.com/forgot-password.png",

  props: {
    columnCondition: {
      type: "choice",
      displayName: "Colonne à comparer",
      description: "Nom de la colonne de la lésion à comparer avec l'étape",
      options: ["category_fr", "name_fr", "type", "status"],
    },
    stepCondition: {
      type: "string",
      displayName: "Valeur attendue",
      description: "Valeur à comparer avec la colonne choisie",
      defaultValue: "",
    },

    itemClassName: {
      type: "class",
      displayName: "Classe pour la ligne",
      description: "Appliquée à chaque <li> de la liste",
    },
    checkboxClassName: {
      type: "class",
      displayName: "Classe pour la checkbox",
      description: "Appliquée à chaque <input type='checkbox'>",
    },
    labelClassName: {
      type: "class",
      displayName: "Classe pour le texte",
      description: "Appliquée au <span> contenant le texte",
    },
    listClassName: {
        type: "class",
        displayName: "Classe pour le bloc <ul>",
        description: "Appliquée à la balise <ul> contenant la liste",
    },
    checkboxSvg: {
      type: "slot", // Utilisez "slot" pour accepter un composant React
      displayName: "SVG de la checkbox",
      description: "Composant SVG à utiliser à la place de la checkbox",
    },
  },
};

export default LesionsListMeta;
