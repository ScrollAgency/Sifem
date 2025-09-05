import React from "react";
import { useDollarState, generateOnMutateForSpec } from "@plasmicapp/react-web";
import { tableHelpers as RichTable_Helpers } from "@plasmicpkgs/plasmic-rich-components/skinny/rich-table";

type SubmissionItem = { [key: string]: any; id?: string; category_fr?: string; category_en?: string; visible?: boolean };
type OptionItem = { [key: string]: any; type?: string; lesion_id?: string };
type UseBilanStateParams = {
  args: any;
  variants: any;
  lesions: SubmissionItem[];
  options: OptionItem[];
  loading: boolean;
  onSubmissionChange?: (state: {
    submission: SubmissionItem[];
    submissionEndometriome: OptionItem[];
    subSubmission: OptionItem[];
  }) => void;
  $ctx: any;
  $refs: any;
};

export function useBilanState({
  args,
  variants,
  lesions,
  options,
  loading,
  onSubmissionChange,
  $ctx,
  $refs
}: UseBilanStateParams) {
  const $props = React.useMemo(() => ({ ...args, ...variants }), [args, variants]);
  const $queries = React.useMemo(() => ({
    getLesions: { data: lesions },
    getOptions: { data: options },
  }), [lesions, options]);

  const stateSpecs: Parameters<typeof useDollarState>[0] = React.useMemo(
    () => [
      {
        path: "checkbox[].isChecked",
        type: "private",
        variableType: "boolean"
      },
      {
        path: "button.shape",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => "round"
      },
      {
        path: "navbar.show",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => false
      },
      {
        path: "step",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => "Superficielle"
      },
      {
        path: "submission",
        type: "private",
        variableType: "array",
        initFunc: ({ $props, $state, $queries, $ctx }) => []
      },
      {
        path: "subCheckbox[][].isChecked",
        type: "private",
        variableType: "boolean"
      },
      {
        path: "subSubmission",
        type: "private",
        variableType: "array",
        initFunc: ({ $props, $state, $queries, $ctx }) => []
      },
      {
        path: "submissionEndometriome",
        type: "private",
        variableType: "array",
        initFunc: ({ $props, $state, $queries, $ctx }) => []
      },
      {
        path: "button3.shape",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "checkbox2[][].isChecked",
        type: "private",
        variableType: "boolean"
      },
      {
        path: "cat",
        type: "private",
        variableType: "array",
        initFunc: ({ $props, $state, $queries, $ctx }: any) => {
          try {
            const submissionArr: SubmissionItem[] = Array.isArray($state.submission) ? $state.submission : [];
            const removeDup: SubmissionItem[] = Array.from(
              new Map<string, SubmissionItem>(
                submissionArr.map((item: SubmissionItem) => [item["category_fr"] ?? "", item])
              ).values()
            );
            removeDup.forEach((item: SubmissionItem) => (item.visible = true));
            return removeDup.map((item: SubmissionItem) => ({
              category_fr: item.category_fr,
              category_en: item.category_en,
              visible: item.visible
            }));
          } catch (e: any) {
            if (
              e instanceof TypeError ||
              (typeof e === "object" && e !== null && "plasmicType" in e && (e as any)["plasmicType"] === "PlasmicUndefinedDataError")
            ) {
              return [];
            }
            throw e;
          }
        }
      },
      {
        path: "subCheckbox2[][][].isChecked",
        type: "private",
        variableType: "boolean"
      },
      {
        path: "videoModal.isOpen",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => {
          try {
            return $state.videoOpen;
          } catch (e: any) {
            if (
              e instanceof TypeError ||
              (typeof e === "object" && e !== null && "plasmicType" in e && e["plasmicType"] === "PlasmicUndefinedDataError")
            ) {
              return undefined;
            }
            throw e;
          }
        }
      },
      {
        path: "videoOpen",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => false
      },
      {
        path: "videoContent",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => ""
      },
      {
        path: "score2",
        type: "private",
        variableType: "number",
        initFunc: ({ $props, $state, $queries, $ctx }: any) => {
          try {
            const catArr: SubmissionItem[] = Array.isArray($state.cat) ? $state.cat : [];
            const submissionArr: SubmissionItem[] = Array.isArray($state.submission) ? $state.submission : [];
            const subSubmissionArr: SubmissionItem[] = Array.isArray($state.subSubmission) ? $state.subSubmission : [];
            return (
              catArr.filter((x: SubmissionItem) =>
                x.category_fr !== "Pathologies associées" &&
                x.category_fr !== "Superficielle" &&
                x.category_fr !== "Annexielle > côté gauche" &&
                x.category_fr !== "Annexielle > côté droit"
              ).length +
              (submissionArr.some((item: SubmissionItem) => item.id === "60") ? 1 : 0) +
              (submissionArr.some((item: SubmissionItem) => item.id === "28")
                ? 1
                : subSubmissionArr.some((item: SubmissionItem) => item.id === "17")
                ? 1
                : 0) +
              (submissionArr.some((item: SubmissionItem) => item.id === "31")
                ? 1
                : subSubmissionArr.some((item: SubmissionItem) => item.id === "18")
                ? 1
                : 0) +
              (submissionArr.some((item: SubmissionItem) => item.id === "29") ? 1 : 0) +
              (submissionArr.some((item: SubmissionItem) => item.id === "32") ? 1 : 0) +
              (submissionArr.some((item: SubmissionItem) => item.id === "35" || item.id === "36") ? 1 : 0) +
              (submissionArr.some((item: SubmissionItem) => item.id === "39" || item.id === "40") ? 1 : 0) +
              (subSubmissionArr.some((item: SubmissionItem) => item.id === "14") ? 1 : 0)
            );
          } catch (e: any) {
            if (
              e instanceof TypeError ||
              (typeof e === "object" && e !== null && "plasmicType" in e && (e as any)["plasmicType"] === "PlasmicUndefinedDataError")
            ) {
              return 0;
            }
            throw e;
          }
        }
      },
      {
        path: "stepLabelsEn",
        type: "private",
        variableType: "array",
        initFunc: ({ $props, $state, $queries, $ctx }) => [
          { name: "Superficielle", name_en: "Superficial" },
          { name: "Annexielle", name_en: "Annexial" },
          { name: "Profonde", name_en: "Deep" },
          { name: "Profonde", name_en: "Deep" },
          { name: "Map", name_en: "Map" },
          { name: "Score", name_en: "Score" }
        ]
      },
      {
        path: "print",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => false
      },
      {
        path: "printType",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => "pdf"
      },
      {
        path: "button5.shape",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "button2.shape",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "button4.shape",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "button6.shape",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "button7.shape",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "button8.shape",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "subCheckbox3",
        type: "private",
        variableType: "array",
        initFunc: ({ $props, $state, $queries, $ctx }) => [
          {
            lesion: "MYOMÈTRE EXTERNE",
            options: [
              { item_fr: "Antérieur", item_en: "Anterior" },
              { item_fr: "Postérieur", item_en: "Posterior" }
            ]
          },
          {
            lesion: "TORUS/LUS PROXIMAUX",
            options: [
              { item_fr: "Droit", item_en: "Right" },
              { item_fr: "Torus", item_en: "Torus" },
              { item_fr: "Gauche", item_en: "Left" }
            ]
          },
          {
            lesion: "RECTUM/CHARNIÈRE RECTOSIGMOÏDIENNE",
            options: [
              { item_fr: "Bas rectum", item_en: "Lower rectum" },
              { item_fr: "Moyen rectum", item_en: "Mid rectum" },
              { item_fr: "Haut rectum", item_en: "Upper rectum" },
              {
                item_fr: "Charnière rectosigmoïdienne",
                item_en: "Rectosigmoid junction"
              }
            ]
          },
          {
            lesion: "LIGAMENT ROND PROXIMAL",
            options: [
              { item_fr: "Droit", item_en: "Right" },
              { item_fr: "Gauche", item_en: "Left" }
            ]
          },
          {
            lesion: "VESSIE",
            options: [
              { item_fr: "Dôme", item_en: "Dome" },
              {
                item_fr: "Cul de sac vesico utérin",
                item_en: "Vesico-uterine pouch"
              },
              { item_fr: "Base", item_en: "Basis" }
            ]
          },
          {
            lesion: "PAROI ABDOMINALE / RÉGION INGUINALE",
            options: [
              { item_fr: "Droit", item_en: "Right" },
              { item_fr: "Gauche", item_en: "Left" }
            ]
          },
          {
            lesion: "URÈTÈRE LOMBAIRE",
            options: [
              { item_fr: "Droit", item_en: "Right" },
              { item_fr: "Gauche", item_en: "Left" }
            ]
          },
          {
            lesion: "NERF PUDENDAL",
            options: [
              { item_fr: "Droit", item_en: "Right" },
              { item_fr: "Gauche", item_en: "Left" }
            ]
          },
          {
            lesion:
              "CÆCUM – ILÉON – APPENDICE –SIGMOÏDE",
            options: [
              { item_fr: "Cæcum", item_en: "Caecum" },
              { item_fr: "Iléon", item_en: "Ileum" },
              { item_fr: "Appendice", item_en: "Appendix" },
              { item_fr: "Sigmoïde", item_en: "Sigmoid colon" }
            ]
          },
          {
            lesion: "DIAPHRAGME",
            options: [
              { item_fr: "Droit", item_en: "Right" },
              { item_fr: "Gauche", item_en: "Left" }
            ]
          }
        ]
      },
      {
        path: "pathologieAssociee[].isChecked",
        type: "private",
        variableType: "boolean"
      },
      {
        path: "filesAbdo",
        type: "private",
        variableType: "array",
        initFunc: ({ $props, $state, $queries, $ctx }) => []
      },
      {
        path: "filesFaceDroite",
        type: "private",
        variableType: "array",
        initFunc: ({ $props, $state, $queries, $ctx }) => []
      },
      {
        path: "filesProfil",
        type: "private",
        variableType: "array",
        initFunc: ({ $props, $state, $queries, $ctx }) => []
      },
      {
        path: "filesFaceGauche",
        type: "private",
        variableType: "array",
        initFunc: ({ $props, $state, $queries, $ctx }) => []
      },
      {
        path: "ressources",
        type: "private",
        variableType: "array",
        initFunc: ({ $props, $state, $queries, $ctx }) => [
          {
            name: "Afena",
            website: "https://www.afena.fr/",
            region: "NOUVELLE AQUITAINE"
          },
          {
            name: "Endora",
            website: "https://www.endaura.fr/",
            region: "AUVERGNE RHONE ALPES"
          },
          {
            name: "Endo BFC",
            website: "https://endo-bfc.fr/",
            region: "BOURGOGNE FRANCHE COMTE"
          },
          {
            name: "ENDO centre ouest IDF",
            website: "https://www.endo-idf.fr/",
            region: "ILE DE FRANCE"
          },
          {
            name: "ENDObreizh",
            website: "https://www.endobreizh.com/",
            region: "BRETAGNE"
          },
          {
            name: "EndOccitanie",
            website: "https://www.endoccitanie.fr/",
            region: "OCCITANIE"
          },
          {
            name: "EndoCentre",
            website: "https://www.endocentrevdl.fr/",
            region: "CENTRE VAL DE LOIRE"
          },
          {
            name: "EndoSud",
            website: "https://endosudpaca.fr/",
            region: "PACA"
          },
          {
            name: "EndoSud IDF",
            website: "https://www.endo-idf.fr/",
            region: "ILE DE FRANCE"
          },
          {
            name: "FEnM Martinique",
            website: "https://fenm.org/nos-missions",
            region: "OUTRE MER"
          },
          {
            name: "Filière endométriose nord est",
            website: "https://www.endo-idf.fr/",
            region: "ILE DE FRANCE"
          },
          {
            name: "Voyelle",
            website: "https://www.endo-idf.fr/",
            region: "ILE DE FRANCE"
          },
          {
            name: "Norm’Endo",
            website: "https://endometriose-normandie.fr/ ",
            region: "NORMANDIE"
          }
        ]
      },
      {
        path: "table2.selectedRowKey",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined,
        onMutate: generateOnMutateForSpec("selectedRowKey", RichTable_Helpers)
      },
      {
        path: "table2.selectedRow",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined,
        onMutate: generateOnMutateForSpec("selectedRow", RichTable_Helpers)
      },
      {
        path: "table2.selectedRows",
        type: "private",
        variableType: "array",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined,
        onMutate: generateOnMutateForSpec("selectedRows", RichTable_Helpers)
      },
      {
        path: "table2.selectedRowKeys",
        type: "private",
        variableType: "array",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined,
        onMutate: generateOnMutateForSpec("selectedRowKeys", RichTable_Helpers)
      },
      {
        path: "addEnd[].shape",
        type: "private",
        variableType: "text"
      },
      {
        path: "endo[].submissionEndometriome",
        type: "private",
        variableType: "array"
      },
      {
        path: "endo[].lesionId",
        type: "private",
        variableType: "number"
      }
    ],
    [$props, $ctx, $refs]
  );

  const $state = useDollarState(stateSpecs, {
    $props,
    $ctx,
    $queries,
    $refs
  });

  React.useEffect(() => {
    if (typeof onSubmissionChange === 'function') {
      onSubmissionChange({
        submission: $state.submission,
        submissionEndometriome: $state.submissionEndometriome,
        subSubmission: $state.subSubmission,
      });
    }
  }, [$state.submission, $state.submissionEndometriome, $state.subSubmission, onSubmissionChange]);

  return { $state, $props, $queries };
}
