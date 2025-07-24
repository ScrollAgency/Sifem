/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type PlusIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function PlusIcon(props: PlusIconProps) {
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
          "M17.494 10.619a.875.875 0 00-.619-1.494h-6v-6a.875.875 0 00-1.75 0v6h-6a.875.875 0 000 1.75h6v6a.875.875 0 101.75 0v-6h6a.875.875 0 00.619-.256z"
        }
        fill={"currentColor"}
        stroke={"currentColor"}
        strokeWidth={".5"}
      ></path>
    </svg>
  );
}

export default PlusIcon;
/* prettier-ignore-end */
