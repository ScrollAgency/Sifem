import * as React from "react";
import {
  PlasmicAddEndo,
  DefaultAddEndoProps
} from "./plasmic/sifem/PlasmicAddEndo";

export interface AddEndoProps extends DefaultAddEndoProps {}

function AddEndo(props: AddEndoProps) {

  return <PlasmicAddEndo {...props} />;
}

export default AddEndo;
