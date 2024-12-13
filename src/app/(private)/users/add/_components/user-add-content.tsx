import { Button } from "@nextui-org/react";
import { RiArrowLeftLine } from "react-icons/ri";
import UserForm from "../../_components/user-form";

const UserAddContent: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <div className="flex gap-2 items-center mb-4">
        <Button
          isIconOnly
          radius="full"
          variant="light"
          onClick={() => router.push("/users")}
        >
          <RiArrowLeftLine size={20} />
        </Button>
        <h1 className="font-semibold text-xl">Add New User</h1>
      </div>

      <div className="ml-12">
        <UserForm />
      </div>
    </>
  );
};

export default UserAddContent;
