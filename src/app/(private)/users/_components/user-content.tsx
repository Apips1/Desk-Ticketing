import { Button, Input, useDisclosure } from "@nextui-org/react";
import { RiAddLine, RiSearchLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import UserTable from "./user-table";
import ModalConfirmDelete from "@/components/ModalConfirmDelete";

const UserContent: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <div className="flex md:justify-between gap-4 items-end mb-4">
        <div>
          <h1 className="font-semibold text-xl mb-1">User Management</h1>
          <p className="text-sm text-gray-500">
            Manage user who can acces the desk ticketing
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <Input
            variant="bordered"
            endContent={<RiSearchLine />}
            placeholder="Search by ID"
          />

          <Button
            className="flex-none"
            color="primary"
            endContent={<RiAddLine />}
            onClick={() => router.push("/users/add")}
          >
            Add New User
          </Button>
        </div>
      </div>

      <UserTable />
    </>
  );
};

export default UserContent;
