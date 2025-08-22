/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Outlined2IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Outlined2Icon(props: Outlined2IconProps) {
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
          "M19.167 8.75H11.25V.833h-2.5V8.75H.833v2.5H8.75v7.917h2.5V11.25h7.917v-2.5z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default Outlined2Icon;
/* prettier-ignore-end */
