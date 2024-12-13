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

interface ModalFilterProps {
  isOpen: boolean;
  defaultValue?: any;
  onOpenChange?: (val: boolean) => void;
  onFilter?: (val: any) => void;
  onReset?: () => void;
}

const ModalFilter: FC<ModalFilterProps> = ({
  isOpen,
  defaultValue,
  onOpenChange,
  onFilter,
  onReset,
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

  const handleFilter = () => {
    onFilter && onFilter(getValues());
    onOpenChange && onOpenChange(false);
  };

  const handleReset = () => {
    reset();
    onReset && onReset();
    onOpenChange && onOpenChange(false);
  };

  useEffect(() => {
    if (isOpen) {
      setValue("sort", defaultValue.sort);
      setValue("customer_id", defaultValue.customer_id);
      setValue("ticket_id", defaultValue.ticket_id);
      setValue("subject", defaultValue.subject);
      setValue("status", defaultValue.status || []);
    } else {
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
              <h1 className="font-semibold text-xl">Filter</h1>
            </ModalHeader>
            <ModalBody>
              <Select
                {...register("sort")}
                selectedKeys={[watch("sort")]}
                className=""
                label="Sort by"
              >
                <SelectItem key={"value"}>Value</SelectItem>
              </Select>
              <Select
                {...register("customer_id")}
                selectedKeys={[watch("customer_id")]}
                className=""
                label="Select Customer"
              >
                <SelectItem key={"value"}>Value</SelectItem>
              </Select>
              <Input {...register("ticket_id")} label="Search by Ticket ID" />
              <Input {...register("subject")} label="Search by Subject" />
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
                <Button
                  className="flex-none h-6 px-1 gap-1"
                  size="sm"
                  radius="full"
                  variant={hasStatus("cancel") == -1 ? "bordered" : "solid"}
                  onClick={() => handleToggleStatus("cancel")}
                >
                  <div className="p-1 rounded-full bg-red-300"></div>
                  Cancel
                </Button>
              </div>
            </ModalBody>
            <ModalFooter className="justify-center">
              <Button radius="full" variant="bordered" onClick={handleReset}>
                Reset
              </Button>
              <Button radius="full" color="primary" onClick={handleFilter}>
                Filter
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalFilter;
