/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type IconsaxLinearHambergermenuIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function IconsaxLinearHambergermenuIcon(
  props: IconsaxLinearHambergermenuIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 30 30"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={"M3.75 8.75h22.5M3.75 15h22.5m-22.5 6.25h22.5"}
        stroke={"currentColor"}
        strokeWidth={"2"}
        strokeLinecap={"round"}
      ></path>
    </svg>
  );
}

export default IconsaxLinearHambergermenuIcon;
/* prettier-ignore-end */
