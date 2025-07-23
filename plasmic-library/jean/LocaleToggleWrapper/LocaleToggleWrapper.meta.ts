const LocaleToggleWrapperMeta = {
  name: "LocaleToggleWrapper",
  section: "2- Jean",
  displayName: "Local toggle wrapper",
  description: "Liste les lésions via le contexte",
  importPath: "@plasmic-library/jean/LocaleToggleWrapper/LocaleToggleWrapper",
  thumbnailUrl: "https://plasmic-api.agence-scroll.com/forgot-password.png",

  props: {
    children: 'slot'
  },
  providesData: true,
  refActions: {
    setLocale: {
      argTypes: [
        {
          name: 'locale',
          type: 'string',
          displayName: 'Locale'
        }
      ],
      displayName: 'Set locale'
    }
  }
};

export default LocaleToggleWrapperMeta;
