/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Checkbox2SvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Checkbox2SvgIcon(props: Checkbox2SvgIconProps) {
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

      <rect
        width={"19"}
        height={"19"}
        x={".5"}
        y={".5"}
        fill={"#fff"}
        rx={"9.5"}
      ></rect>

      <rect
        width={"19"}
        height={"19"}
        x={".5"}
        y={".5"}
        stroke={"#ECDFEC"}
        rx={"9.5"}
      ></rect>
    </svg>
  );
}

export default Checkbox2SvgIcon;
/* prettier-ignore-end */
