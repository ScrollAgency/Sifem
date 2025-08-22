/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Vector7SvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Vector7SvgIcon(props: Vector7SvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 15 16"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M14.5 10.875a.624.624 0 01-.625.625H12v1.25h1.25a.624.624 0 110 1.25H12v1.25a.624.624 0 11-1.25 0v-4.375a.624.624 0 01.625-.625h2.5a.624.624 0 01.625.625zM4.187 12.438A2.187 2.187 0 012 14.624h-.625v.625a.625.625 0 11-1.25 0v-4.375a.625.625 0 01.625-.625H2a2.188 2.188 0 012.188 2.188zm-1.25 0A.937.937 0 002 11.5h-.625v1.875H2a.938.938 0 00.938-.938zm6.876.624A2.812 2.812 0 017 15.876H5.75a.625.625 0 01-.625-.625v-4.375a.625.625 0 01.625-.625H7a2.812 2.812 0 012.813 2.813zm-1.25 0A1.563 1.563 0 007 11.5h-.625v3.125H7a1.563 1.563 0 001.563-1.563zM.124 7.75V2.125a1.25 1.25 0 011.25-1.25h7.5a.625.625 0 01.442.183l4.375 4.375a.626.626 0 01.183.442V7.75a.625.625 0 11-1.25 0V6.5h-3.75a.625.625 0 01-.625-.625v-3.75H1.375V7.75a.625.625 0 01-1.25 0zM9.5 5.25h2.241L9.5 3.009V5.25z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default Vector7SvgIcon;
/* prettier-ignore-end */
