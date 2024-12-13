import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { RiFileCopyFill } from "react-icons/ri";

interface CustomerFormProps {
  isEdit?: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ isEdit }) => {
  const router = useRouter();

  return (
    <form>
      <div className="flex flex-col gap-4">
        <Input
          label="Customer Name"
          labelPlacement="outside"
          variant="bordered"
          placeholder="Customer Name"
          isRequired
        />

        <Input
          label="Customer Email"
          labelPlacement="outside"
          variant="bordered"
          placeholder="Email"
          type="email"
          isRequired
        />

        <Input
          classNames={{ input: "mt-2.5" }}
          label="Customer Logo"
          labelPlacement="outside"
          placeholder="Select Image"
          variant="bordered"
          type="file"
          accept="image/*"
          // isRequired
        />

        <div className="flex items-end gap-1">
          <Input
            label="Setting Subdomain*"
            labelPlacement="outside"
            variant="bordered"
            placeholder="subdomain"
            content=""
            type="email"
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">https://</span>
              </div>
            }
            endContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">
                  .solutionlab.id
                </span>
              </div>
            }
            isRequired
          />

          <Button isIconOnly variant="light" radius="full" color="primary">
            <RiFileCopyFill size={20} />
          </Button>
          <Button isIconOnly variant="light" radius="full" color="primary">
            <BsBoxArrowUpRight size={20} />
          </Button>
        </div>

        <div className="flex gap-4">
          <Button variant="bordered" onClick={() => router.push("/customers")}>
            Cancel
          </Button>
          <Button type="submit" color="primary">
            {isEdit ? "Update" : "Add"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CustomerForm;
