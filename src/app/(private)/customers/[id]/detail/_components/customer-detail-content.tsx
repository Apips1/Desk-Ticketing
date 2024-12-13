"use client";

import { Button, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { FiArrowLeftCircle } from "react-icons/fi";
import ChartLine from "@/components/ChartLine";
import CustomerTicketList from "./customer-ticket-list";
import { RiArrowLeftLine } from "react-icons/ri";
import CardCustomer from "@/components/CardCustomer";

const CustomerDetailContent: React.FC = () => {
  const router = useRouter();
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
        <h1 className="font-semibold text-xl">Customer Detail</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <CardCustomer isDetail />
        </div>

        <ChartLine height={200} />
      </div>

      <CustomerTicketList />
    </>
  );
};

export default CustomerDetailContent;
