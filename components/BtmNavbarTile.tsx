import * as React from "react";
import {
  PlasmicBtmNavbarTile,
  DefaultBtmNavbarTileProps
} from "./plasmic/sifem/PlasmicBtmNavbarTile";
import { HTMLElementRefOf } from "@plasmicapp/react-web";

export interface BtmNavbarTileProps extends DefaultBtmNavbarTileProps {}

function BtmNavbarTile_(
  props: BtmNavbarTileProps,
  ref: HTMLElementRefOf<"div">
) {

  return <PlasmicBtmNavbarTile mobileNavbarTiles8={{ ref }} {...props} />;
}

const BtmNavbarTile = React.forwardRef(BtmNavbarTile_);
export default BtmNavbarTile;
