/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type FilePdfIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function FilePdfIcon(props: FilePdfIconProps) {
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
          "M17.5 11.875a.624.624 0 01-.625.625H15v1.25h1.25a.624.624 0 110 1.25H15v1.25a.624.624 0 11-1.25 0v-4.375a.624.624 0 01.625-.625h2.5a.624.624 0 01.625.625zM7.187 13.438A2.187 2.187 0 015 15.624h-.625v.625a.625.625 0 11-1.25 0v-4.375a.625.625 0 01.625-.625H5a2.188 2.188 0 012.188 2.188zm-1.25 0A.937.937 0 005 12.5h-.625v1.875H5a.938.938 0 00.938-.938zm6.875.624A2.812 2.812 0 0110 16.875H8.75a.625.625 0 01-.625-.625v-4.375a.625.625 0 01.625-.625H10a2.812 2.812 0 012.813 2.813zm-1.25 0A1.563 1.563 0 0010 12.5h-.625v3.125H10a1.563 1.563 0 001.563-1.563zM3.126 8.75V3.125a1.25 1.25 0 011.25-1.25h7.5a.625.625 0 01.442.183l4.375 4.375a.626.626 0 01.183.442V8.75a.625.625 0 11-1.25 0V7.5h-3.75a.625.625 0 01-.625-.625v-3.75H4.375V8.75a.625.625 0 01-1.25 0zm9.375-2.5h2.241L12.5 4.009V6.25z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default FilePdfIcon;
/* prettier-ignore-end */
