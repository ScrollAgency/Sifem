/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

import * as React from "react";
import { createUseScreenVariants } from "@plasmicapp/react-web";

export type LocaleValue = "fr" | "en";
export const LocaleContext = React.createContext<LocaleValue | undefined>(
  "PLEASE_RENDER_INSIDE_PROVIDER" as any
);
export function LocaleContextProvider(
  props: React.PropsWithChildren<{ value: LocaleValue | undefined }>
) {
  return (
    <LocaleContext.Provider value={props.value}>
      {props.children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return React.useContext(LocaleContext);
}

export default LocaleContext;
/* prettier-ignore-end */
