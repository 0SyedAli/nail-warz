import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from "@chakra-ui/react";


function Modal({ isOpen, onClose, children, modalClass }) {
  return (
    <ChakraModal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className={modalClass}>
        <ModalBody>
          <div className={`modal_container `}>
            <div className="modal_container_body">{children}</div>
          </div>
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  );
}

export default Modal;
