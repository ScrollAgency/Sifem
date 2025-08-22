/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Checkbox1SvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Checkbox1SvgIcon(props: Checkbox1SvgIconProps) {
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
        x={".5"}
        y={".5"}
        width={"19"}
        height={"19"}
        rx={"9.5"}
        fill={"#EA5886"}
      ></rect>

      <rect
        x={".5"}
        y={".5"}
        width={"19"}
        height={"19"}
        rx={"9.5"}
        stroke={"#EA5886"}
      ></rect>

      <path
        d={"M14.667 6.5L8.25 12.917 5.333 10"}
        stroke={"#fff"}
        strokeWidth={"2"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      ></path>
    </svg>
  );
}

export default Checkbox1SvgIcon;
/* prettier-ignore-end */
