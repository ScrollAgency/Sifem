/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type CaretDownIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function CaretDownIcon(props: CaretDownIconProps) {
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
          "M16.692 7.942l-6.25 6.25a.627.627 0 01-.884 0l-6.25-6.25a.625.625 0 01.884-.884L10 12.866l5.808-5.808a.626.626 0 01.884.884z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default CaretDownIcon;
/* prettier-ignore-end */
