import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { BiRegistered } from "react-icons/bi";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { RiFileCopyFill } from "react-icons/ri";

interface UserFormProps {
  isEdit?: boolean;
  defaultValue?: any;
  onCallback?: () => void;
}

interface UserFormValue {
  name: string;
  email: string;
  position: string;
}

const UserForm: React.FC<UserFormProps> = ({
  isEdit,
  defaultValue,
  onCallback,
}) => {
  const { register, setValue, handleSubmit } = useForm<UserFormValue>({});
  const router = useRouter();

  const onSubmit = (value: UserFormValue) => {
    onCallback && onCallback();
  };

  useEffect(() => {
    if (defaultValue) {
      setValue("name", defaultValue.name);
      setValue("email", defaultValue.email);
      setValue("position", defaultValue.position);
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <Input
          {...register("name")}
          label="Name"
          labelPlacement="outside"
          variant="bordered"
          placeholder="Name"
          isRequired
        />

        <Input
          {...register("email")}
          label="Email"
          labelPlacement="outside"
          variant="bordered"
          placeholder="Email"
          type="email"
          isRequired
        />

        <Input
          {...register("position")}
          label="Position"
          labelPlacement="outside"
          variant="bordered"
          placeholder="Position"
          isRequired
        />

        <div className="flex gap-4">
          <Button variant="bordered" onClick={() => router.push("/users")}>
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

export default UserForm;
