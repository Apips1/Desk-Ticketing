import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

interface ModalDeleteProps {
  isOpen?: boolean;
  onOpenChange?: (val: boolean) => void;
  onDelete?: () => void;
}

const ModalDelete: React.FC<ModalDeleteProps> = ({
  isOpen,
  onOpenChange,
  onDelete,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="justify-center">
              <h3 className="font-medium">ATTENTION</h3>
            </ModalHeader>
            <ModalBody>
              <p className="text-center">
                Are you sure to delete this customer?
              </p>
            </ModalBody>
            <ModalFooter className="justify-center">
              <Button variant="bordered" onClick={onClose}>
                Cancel
              </Button>
              <Button color="danger" onClick={onDelete}>
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalDelete;
