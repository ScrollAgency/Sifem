/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Vector5SvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Vector5SvgIcon(props: Vector5SvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 14 9"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M.307 7.058l6.25-6.25a.625.625 0 01.885 0l6.25 6.25a.625.625 0 11-.885.884L7 2.134 1.192 7.942a.625.625 0 11-.885-.884z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default Vector5SvgIcon;
/* prettier-ignore-end */
