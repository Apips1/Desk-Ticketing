"use client";
import { Button } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { FiArrowLeftCircle } from "react-icons/fi";
import CustomerForm from "../../_components/customer-form";
import { RiArrowLeftLine } from "react-icons/ri";

const CustomerEditContent: React.FC = () => {
  const router = useRouter();
  const { watch, register, handleSubmit } = useForm();

  return (
    <>
      <div className="flex items-center mb-4">
        <Button
          isIconOnly
          radius="full"
          variant="light"
          onClick={() => router.push("/customers")}
        >
          <RiArrowLeftLine size={20} />
        </Button>
        <h1 className="font-semibold text-xl">Update Customer Information</h1>
      </div>

      <CustomerForm isEdit />
    </>
  );
};

export default CustomerEditContent;
