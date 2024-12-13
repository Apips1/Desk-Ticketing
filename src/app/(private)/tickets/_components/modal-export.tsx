import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { FC } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import InputDatePicker from "@/components/InputDatePicker";

interface ModalExportProps {
  isOpen: boolean;
  onOpenChange?: (val: boolean) => void;
  onCallback?: () => void;
}

const ModalExport: FC<ModalExportProps> = ({
  isOpen,
  onOpenChange,
  onCallback,
}) => {
  const { getValues, register, watch, control, setValue, reset } = useForm();
  const { append, remove } = useFieldArray({ control, name: "status" });

  const hasStatus = (status: string) => {
    const value: string[] = getValues("status") || [];
    return value.indexOf(status);
  };

  const handleToggleStatus = (status: string) => {
    const index = hasStatus(status);
    if (index == -1) append(status);
    else remove(index);
  };

  const handleExport = () => {
    onOpenChange && onOpenChange(false);
    onCallback && onCallback();
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(val) => onOpenChange && onOpenChange(val)}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="justify-center">
              <h1 className="font-semibold text-xl">Export</h1>
            </ModalHeader>
            <ModalBody>
              <InputDatePicker {...register("start_date")} label="Start Date" />

              <InputDatePicker {...register("end_date")} label="End Date" />

              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  className="flex-none h-6 px-1 gap-1"
                  size="sm"
                  radius="full"
                  variant={hasStatus("open") == -1 ? "bordered" : "solid"}
                  onClick={() => handleToggleStatus("open")}
                >
                  <div className="p-1 rounded-full bg-blue-300"></div>
                  Open
                </Button>
                <Button
                  className="flex-none h-6 px-1 gap-1"
                  size="sm"
                  radius="full"
                  variant={hasStatus("closed") == -1 ? "bordered" : "solid"}
                  onClick={() => handleToggleStatus("closed")}
                >
                  <div className="p-1 rounded-full bg-gray-400"></div>
                  Closed
                </Button>
                <Button
                  className="flex-none h-6 px-1 gap-1"
                  size="sm"
                  radius="full"
                  variant={
                    hasStatus("in_progress") == -1 ? "bordered" : "solid"
                  }
                  onClick={() => handleToggleStatus("in_progress")}
                >
                  <div className="p-1 rounded-full bg-orange-300"></div>
                  In Progress
                </Button>
                <Button
                  className="flex-none h-6 px-1 gap-1"
                  size="sm"
                  radius="full"
                  variant={hasStatus("resolved") == -1 ? "bordered" : "solid"}
                  onClick={() => handleToggleStatus("resolved")}
                >
                  <div className="p-1 rounded-full bg-green-300"></div>
                  Resolve
                </Button>
                {/* <Button
                  className="flex-none h-6 px-1 gap-1"
                  size="sm"
                  radius="full"
                  variant={hasStatus("cancel") == -1 ? "bordered" : "solid"}
                  onClick={() => handleToggleStatus("cancel")}
                >
                  <div className="p-1 rounded-full bg-red-300"></div>
                  Cancel
                </Button> */}
              </div>
            </ModalBody>
            <ModalFooter className="justify-center">
              <Button
                radius="full"
                variant="bordered"
                onClick={() => onOpenChange && onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button radius="full" color="primary" onClick={handleExport}>
                Export
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalExport;
