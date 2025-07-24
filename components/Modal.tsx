import * as React from "react";
import {
  PlasmicModal,
  DefaultModalProps
} from "./plasmic/copy_of_sifem_production_for_update_electric/PlasmicModal";

export interface ModalProps extends DefaultModalProps {}

function Modal(props: ModalProps) {


  return <PlasmicModal {...props} />;
}

export default Modal;
