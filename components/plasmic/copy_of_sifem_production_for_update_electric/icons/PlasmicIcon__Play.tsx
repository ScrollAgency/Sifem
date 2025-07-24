/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type PlayIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function PlayIcon(props: PlayIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 12 12"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M11.25 6a.737.737 0 01-.356.633L4.14 10.765A.75.75 0 013 10.13V1.87a.743.743 0 01.762-.744.75.75 0 01.378.11l6.754 4.132A.737.737 0 0111.25 6z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default PlayIcon;
/* prettier-ignore-end */
