import ModalFilter from "@/app/(private)/tickets/_components/modal-filter";
import {
  Button,
  Image,
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { HiOutlineFilter } from "react-icons/hi";

interface CustomerTicketListProps {}

const TableHeaders = [
  { label: "Ticket ID", key: "ticketId" },
  { label: "Customer", key: "customer" },
  { label: "Subject", key: "subject" },
  { label: "Created on", key: "createdOn" },
  { label: "Closed at", key: "closedAt" },
  { label: "Priority", key: "priority" },
  { label: "Status", key: "status" },
  { label: "", key: "action" },
];

const CustomerTicketList: React.FC<CustomerTicketListProps> = ({}) => {
  const {
    isOpen: isFilterOpen,
    onOpen: onFilterOpen,
    onOpenChange: onFilterOpenChange,
  } = useDisclosure();

  const [filter, setFilter] = useState<any>({});

  const renderCell = useCallback((row: any, key: React.Key) => {
    switch (key) {
      case "ticketId":
        return <>ID-12345678</>;
      case "customer":
        return (
          <div className="rounded bg-slate-200 py-1 px-3 inline-flex gap-2 items-center">
            <Image
              width={16}
              height={16}
              alt="LOGO"
              className="flex-none"
              src="/assets/cust-sm-1.png"
            />
            <span className="text-sm font-semibold">BRI</span>
          </div>
        );
      case "subject":
        return <>Update New Feature</>;
      case "createdOn":
        return <>07/09/2024</>;
      case "closedAt":
        return <>07/09/2024</>;
      case "priority":
        return <>Critical</>;
      case "status":
        return (
          <div>
            <div className="flex gap-2 items-center ">
              <div className="rounded-full p-1.5 flex-none bg-orange-300"></div>
              <div>In Progress</div>
            </div>
            <div className="flex gap-2 items-center ">
              <div className="rounded-full p-1.5 flex-none bg-green-300"></div>
              <div>Open</div>
            </div>
            <div className="flex gap-2 items-center ">
              <div className="rounded-full p-1.5 flex-none bg-blue-300"></div>
              <div>Resolved</div>
            </div>
          </div>
        );
      case "action":
        return <Link href={`/tickets/${"id"}`}>View</Link>;
      default:
        return <></>;
    }
  }, []);

  const handleFilter = (val: any) => {
    setFilter(val);
  };

  const handleReset = () => {
    setFilter({});
  };

  return (
    <>
      <div className="p-4 border rounded">
        <div className="flex md:justify-between gap-4 items-end mb-4">
          <h1 className="font-semibold text-xl mb-1">Ticket List</h1>

          <div className="flex gap-4 items-center">
            <Input
              variant="bordered"
              endContent={<FaSearch />}
              placeholder="Search by ID"
            />
            <Button
              className="flex-none"
              startContent={<HiOutlineFilter size={20} />}
              onClick={() => onFilterOpen()}
            >
              Filter
            </Button>
          </div>
        </div>

        <Table className="mb-4" removeWrapper border={1}>
          <TableHeader columns={TableHeaders}>
            {(col) => <TableColumn key={col.key}>{col.label}</TableColumn>}
          </TableHeader>
          <TableBody items={[{ key: 1 }]}>
            {(row) => (
              <TableRow key={row.key}>
                {(key) => (
                  <TableCell className="border-b">
                    {renderCell(row, key)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex justify-center items-center gap-2">
          <Button className="h-9" variant="bordered">
            <FaChevronLeft />
            Prev
          </Button>
          <Pagination variant="bordered" initialPage={1} total={10} />
          <Button className="h-9" variant="bordered">
            Next
            <FaChevronRight />
          </Button>
        </div>
      </div>

      <ModalFilter
        isOpen={isFilterOpen}
        onOpenChange={onFilterOpenChange}
        defaultValue={filter}
        onFilter={handleFilter}
        onReset={handleReset}
      />
    </>
  );
};

export default CustomerTicketList;
