import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiMore2Fill,
} from "react-icons/ri";
import ModalConfirmDelete from "@/components/ModalConfirmDelete";

const COLUMNS = [
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Position", key: "position" },
  { label: "Last Activity", key: "lastActivity" },
  { label: "Action", key: "action" },
];

const UserTable: React.FC = () => {
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();
  const router = useRouter();
  const [items, setItems] = useState([{ key: 1 }]);

  const handleDelete = () => {};

  const renderCell = useCallback((item: any, key: React.Key) => {
    switch (key) {
      case "name":
        return (
          <div className="flex items-center gap-1">
            <Avatar size="sm" name="JF" />
            <div>Joe Franky</div>
          </div>
        );
      case "email":
        return <>joefranky@gmail.com</>;
      case "position":
        return <>Manager</>;
      case "lastActivity":
        return <>Sept, 25 2024</>;
      case "action":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light" radius="full">
                <RiMore2Fill />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem onClick={() => router.push("/users/[id]/edit")}>
                Edit
              </DropdownItem>
              <DropdownItem color="danger" className="text-danger-500" onClick={onDeleteOpen}>
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return "";
    }
  }, []);

  return (
    <>
      <Table className="mb-4" removeWrapper border={1}>
        <TableHeader columns={COLUMNS}>
          {(col) => <TableColumn key={col.key}>{col.label}</TableColumn>}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.key}>
              {(key) => (
                <TableCell className="border-b">
                  {renderCell(item, key)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-center items-center gap-2">
        <Button
          className="h-9"
          variant="bordered"
          startContent={<RiArrowLeftSLine size={20} />}
        >
          Prev
        </Button>
        <Pagination variant="bordered" initialPage={1} total={10} />
        <Button
          className="h-9"
          variant="bordered"
          endContent={<RiArrowRightSLine size={20} />}
        >
          Next
        </Button>
      </div>

      <ModalConfirmDelete
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        onDelete={handleDelete}
        content="Are you sure to delete this user?"
      />
    </>
  );
};

export default UserTable;
