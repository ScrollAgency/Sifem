/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type FilePngIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function FilePngIcon(props: FilePngIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 20 20"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M4.688 11.25h-1.25a.625.625 0 00-.626.625v4.375a.625.625 0 101.25 0v-.625h.625a2.188 2.188 0 000-4.375zm0 3.125h-.625V12.5h.625a.938.938 0 010 1.875zM17.5 15.693c0 .16-.062.316-.173.432a2.35 2.35 0 01-1.702.75c-1.379 0-2.5-1.262-2.5-2.813 0-1.55 1.121-2.812 2.5-2.812a2.3 2.3 0 011.288.4.627.627 0 01-.704 1.036 1.032 1.032 0 00-.584-.186c-.69 0-1.25.703-1.25 1.563 0 .859.56 1.562 1.25 1.562a1.06 1.06 0 00.625-.213V15a.624.624 0 110-1.25h.625a.624.624 0 01.625.625v1.318zm-5.313-3.818v4.375a.625.625 0 01-1.133.363l-1.992-2.785v2.422a.625.625 0 11-1.25 0v-4.375a.625.625 0 011.134-.363l1.992 2.785v-2.422a.624.624 0 111.25 0zm-8.437-2.5a.625.625 0 00.625-.625V3.125h6.875v3.75a.625.625 0 00.625.625h3.75v1.25a.625.625 0 101.25 0V6.875a.624.624 0 00-.183-.442l-4.375-4.375a.625.625 0 00-.442-.183h-7.5a1.25 1.25 0 00-1.25 1.25V8.75a.625.625 0 00.625.625zm8.75-5.366l2.241 2.241H12.5V4.009z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default FilePngIcon;
/* prettier-ignore-end */
