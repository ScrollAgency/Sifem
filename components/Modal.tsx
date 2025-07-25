import * as React from "react";
import {
  PlasmicModal,
  DefaultModalProps
} from "./plasmic/sifem/PlasmicModal";

export interface ModalProps extends DefaultModalProps {}

function Modal(props: ModalProps) {


  return <PlasmicModal {...props} />;
}

export default Modal;
