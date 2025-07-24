/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type TriangleIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function TriangleIcon(props: TriangleIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 32 32"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M17.801 5.027l10.933 18.984C29.5 25.35 28.51 27 26.932 27H5.069C3.49 27 2.5 25.349 3.265 24.011L14.2 5.028c.787-1.37 2.815-1.37 3.602 0z"
        }
        fill={"currentColor"}
        stroke={"currentColor"}
        strokeWidth={"2"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      ></path>
    </svg>
  );
}

export default TriangleIcon;
/* prettier-ignore-end */
