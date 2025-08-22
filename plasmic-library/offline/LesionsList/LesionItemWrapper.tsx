import * as React from "react";
import { isValidElement, cloneElement } from "react";

export function LesionItemWrapper({
  children,
  currentItem,
}: {
  children?: React.ReactNode;
  currentItem: any;
}) {
  if (isValidElement(children)) {
    return cloneElement(children as React.ReactElement<any>, { currentItem });
  }

  return <>{children}</>;
}
