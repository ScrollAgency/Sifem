import * as React from "react";
import { useRouter } from "next/router";
import GlobalContextsProvider from "../components/plasmic/sifem/PlasmicGlobalContextsProvider";
import { LocaleContextProvider } from "../components/plasmic/sifem/PlasmicGlobalVariant__Locale";
import { PageParamsProvider } from "@plasmicapp/react-web/lib/host";
import { PlasmicBilan } from "../components/plasmic/sifem/PlasmicBilan";
import { useData } from "@/contexts/DataContext";
import { useState } from "react";

// Define FileObject type (adjust fields as needed)
type FileObject = {
  // Example fields, update according to your actual data structure
  name: string;
  size: number;
  type: string;
};


function Bilan() {
  const router = useRouter();
  const { lesions, options, loading } = useData();

  const [lesionsFaceGauche, setLesionsFaceGauche] = useState<FileObject[]>([]);
  const [lesionsFaceDroite, setLesionsFaceDroite] = useState<FileObject[]>([]);
  const [lesionsAbdomen, setLesionsAbdomen] = useState<FileObject[]>([]);
  const [lesionsProfil, setLesionsProfil] = useState<FileObject[]>([]);

  // State for Plasmic selection (true selection state)
  const [plasmicSelection, setPlasmicSelection] = useState<{
    submission: any[];
    submissionEndometriome: any[];
    subSubmission: any[];
    checkbox?: any[];
  }>({ submission: [], submissionEndometriome: [], subSubmission: [] });

  if (loading) return <div>Chargement...</div>;

  // For debug: merge all selected lesions from FileList (old debug)
  const allSelectedLesions = [
    ...lesionsFaceGauche,
    ...lesionsFaceDroite,
    ...lesionsAbdomen,
    ...lesionsProfil,
  ];
  const uniqueLesions = Array.from(
    new Map(allSelectedLesions.map((l: any) => [l.id ?? l.name, l])).values()
  );


  // For debug: merge all selected lesions from Plasmic state (true selection)
  const allPlasmicSelected = [
    ...(plasmicSelection.submission || []),
    ...(plasmicSelection.submissionEndometriome || []),
    ...(plasmicSelection.subSubmission || []),
  ];
  const uniquePlasmicSelected = Array.from(
    new Map(allPlasmicSelected.map((l: any) => [l.id ?? l.name, l])).values()
  );

  // Affichage de l'état de toutes les checkboxs (cochées ou non)
  const allCheckboxes = plasmicSelection.checkbox || [];

  return (
    <LocaleContextProvider value={undefined}>
      <GlobalContextsProvider>
        <PageParamsProvider route={router.pathname} query={router.query} params={router.query}>
          {/* Debug: Affiche l'état de toutes les checkboxs en haut de la page */}
          <div style={{ background: '#e0eaff', padding: 8, marginBottom: 8 }}>
            <strong>État de toutes les checkboxs :</strong>
            <ul style={{ margin: 0 }}>
              {allCheckboxes.length === 0 && <li>Aucune</li>}
              {allCheckboxes.map((cb: any, i: number) => (
                <li key={cb.id ?? i}>
                  {cb.name ?? cb.id ?? i} : {cb.isChecked ? '✔️ cochée' : '❌ décochée'}
                </li>
              ))}
            </ul>
          </div>
          {/* Debug: Affiche les lésions sélectionnées en haut de la page (Plasmic true selection) */}
          <div style={{ background: '#e0ffe0', padding: 8, marginBottom: 8 }}>
            <strong>Lésions sélectionnées (Plasmic state)&nbsp;:</strong>
            <ul style={{ margin: 0 }}>
              {uniquePlasmicSelected.length === 0 && <li>Aucune</li>}
              {uniquePlasmicSelected.map((l: any) => (
                <li key={l.id ?? l.name}>
                  {l.name} {l.id ? `(id: ${l.id})` : ''}
                </li>
              ))}
            </ul>
          </div>
          {/* Debug: Affiche les lésions sélectionnées (FileList, old debug) */}
          <div style={{ background: '#ffe', padding: 8, marginBottom: 16 }}>
            <strong>Lésions sélectionnées (FileList)&nbsp;:</strong>
            <ul style={{ margin: 0 }}>
              {uniqueLesions.length === 0 && <li>Aucune</li>}
              {uniqueLesions.map((l: any) => (
                <li key={l.id ?? l.name}>
                  {l.name} {l.id ? `(id: ${l.id})` : ''}
                </li>
              ))}
            </ul>
          </div>
          <PlasmicBilan
            overrides={{
              imagePovFaceGauche: { onList: (files: any) => setLesionsFaceGauche(files) },
              imagePovFaceDroite: { onList: (files: any) => setLesionsFaceDroite(files) },
              imagePovAbdomen: { onList: (files: any) => setLesionsAbdomen(files) },
              imagePovProfil: { onList: (files: any) => setLesionsProfil(files) },
            }}
            onSubmissionChange={setPlasmicSelection}
          />
        </PageParamsProvider>
      </GlobalContextsProvider>
    </LocaleContextProvider>
  );
}

export default Bilan;
