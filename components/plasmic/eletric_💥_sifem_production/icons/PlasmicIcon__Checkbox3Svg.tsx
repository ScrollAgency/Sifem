/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Checkbox3SvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Checkbox3SvgIcon(props: Checkbox3SvgIconProps) {
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
        fill={"#EA5886"}
        rx={"9.5"}
      ></rect>

      <rect
        width={"19"}
        height={"19"}
        x={".5"}
        y={".5"}
        stroke={"#EA5886"}
        rx={"9.5"}
      ></rect>

      <path
        stroke={"#fff"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        strokeWidth={"2"}
        d={"M14.667 6.5 8.25 12.917 5.333 10"}
      ></path>
    </svg>
  );
}

export default Checkbox3SvgIcon;
/* prettier-ignore-end */
