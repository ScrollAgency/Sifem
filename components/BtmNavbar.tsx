import * as React from "react";
import {
  PlasmicBtmNavbar,
  DefaultBtmNavbarProps
} from "./plasmic/sifem/PlasmicBtmNavbar";
import { HTMLElementRefOf } from "@plasmicapp/react-web";

export interface BtmNavbarProps extends DefaultBtmNavbarProps {}

function BtmNavbar_(props: BtmNavbarProps, ref: HTMLElementRefOf<"div">) {

  return <PlasmicBtmNavbar frame1437254343={{ ref }} {...props} />;
}

const BtmNavbar = React.forwardRef(BtmNavbar_);
export default BtmNavbar;
