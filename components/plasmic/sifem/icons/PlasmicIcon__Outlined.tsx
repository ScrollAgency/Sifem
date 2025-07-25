/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type OutlinedIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function OutlinedIcon(props: OutlinedIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 16 16"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={"M15.333 7H9V.667H7V7H.667v2H7v6.333h2V9h6.333V7z"}
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default OutlinedIcon;
/* prettier-ignore-end */
