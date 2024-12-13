"use client";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FiArrowLeftCircle } from "react-icons/fi";
import CustomerForm from "../../[id]/_components/customer-form";
import { RiArrowLeftLine } from "react-icons/ri";

const CustomerAddContent: React.FC = () => {
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
        <h1 className="font-semibold text-xl">Add New Customer</h1>
      </div>

      <CustomerForm />
    </>
  );
};

export default CustomerAddContent;
