/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ArrowCircleLeftIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function ArrowCircleLeftIcon(props: ArrowCircleLeftIconProps) {
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
          "M16 3a13 13 0 1013 13A13.013 13.013 0 0016 3zm0 24a11 11 0 1111-11 11.012 11.012 0 01-11 11zm6-11a1 1 0 01-1 1h-7.586l2.293 2.293a1 1 0 01-1.415 1.415l-4-4a1.001 1.001 0 010-1.415l4-4a1 1 0 111.415 1.415L13.415 15H21a1 1 0 011 1z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default ArrowCircleLeftIcon;
/* prettier-ignore-end */
