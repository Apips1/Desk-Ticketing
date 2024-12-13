"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Button,
  Chip,
  Input,
  Image,
  useDisclosure,
} from "@nextui-org/react";
import { useState, useCallback, useMemo, Key } from "react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@nextui-org/react";
import { FaFileDownload, FaFolderMinus, FaSearch } from "react-icons/fa";
import {
  ListTicketDatum,
  ResponseListTicket,
} from "@/app/_types/ticket/response-list-ticket";
import { Suspense } from "react";
import {
  HiOutlineClock,
  HiOutlineFilter,
  HiOutlineDownload,
} from "react-icons/hi";
import StatusFilterModal from "./status-filter-modal";
import ExportModal from "./export-data-modal";
import {
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
  FaFilter,
} from "react-icons/fa6";
import Link from "next/link";
import ModalFilter from "./modal-filter";
import ModalExport from "./modal-export";

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

export default function TicketList() {
  const router = useRouter();
  const path = usePathname();
  const qs = useSearchParams();
  const [columns, setColumns] = useState([
    {
      key: "ticket_id",
      uid: "ticket_id",
      name: "Ticket ID",
      sortable: false,
    },
    { key: "subject", uid: "subject", name: "Subject", sortable: false },
    { key: "company", uid: "company", name: "Company", sortable: false },
    {
      key: "created_at",
      uid: "created_at",
      name: "Created on",
      sortable: false,
    },
    {
      key: "close_at",
      uid: "close_at",
      name: "Closed at",
      sortable: false,
    },
    { key: "priority", uid: "priority", name: "Priority", sortable: false },
    { key: "status", uid: "status", name: "Status", sortable: false },
    { key: "actions", uid: "actions", name: "Action", sortable: false },
  ]);

  const {
    isOpen: isFilterOpen,
    onOpen: onFilterOpen,
    onOpenChange: onFilterOpenChange,
  } = useDisclosure();

  const {
    isOpen: isExportOpen,
    onOpen: onExportOpen,
    onOpenChange: onExportOpenChange,
  } = useDisclosure();

  const [filter, setFilter] = useState<any>({});

  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [openExportModal, setOpenExportModal] = useState<boolean>(false);
  const [searchCode, setSearchCode] = useState<string>("");

  const paginationParams = useMemo(() => {
    if (qs.get("id") !== null && qs.get("id") !== "")
      setSearchCode(qs.get("id") ?? "");
    return {
      page: Number(qs.get("page")) || 1,
      limit: qs.get("limit") || 10,
      sort: qs.get("sort") || "createdAt",
      dir: "desc",
      status: qs.get("status") || "",
      subject: qs.get("subject") || "",
      code: qs.get("id") || "",
      companyProductName: qs.get("companyProductName") || "",
    };
  }, [qs]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(qs.toString());
      params.set(name, value);
      return params.toString();
    },
    [qs],
  );

  const { data: tickets, isFetching } = useHttp<ResponseListTicket>(
    "/agent/ticket/list",
    { method: "GET", params: paginationParams },
  );

  const onsubmitSearchId = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const search = target.searchId;
    router.push(`${path}?${createQueryString("id", search.value)}`);
  };

  const renderStatus = useCallback((status: string) => {
    let color = "";
    switch (status) {
      case "open":
        color = "bg-green-500";
        break;
      case "in_progress":
        color = "bg-violet-500";
        break;
      case "close":
        color = "bg-blue-500";
        break;
      case "resolve":
        color = "bg-orange-400";
        break;
      case "cancel":
        color = "bg-red-400";
        break;
      default:
        color = "bg-blue-500";
    }
    return (
      <Chip
        startContent={
          <div className={`mr-1 h-2 w-2 rounded-full ${color}`}></div>
        }
        className="capitalize"
        size="sm"
        variant="bordered"
      >
        {status.replace("_", " ")}
      </Chip>
    );
  }, []);

  const renderCell = useCallback((row: any, key: Key) => {
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

  const bottomContent = () => {
    return (
      <Suspense fallback={<div></div>}>
        <div className="flex items-center justify-start gap-4">
          <p className="text-sm text-gray-500">
            Total {tickets?.data?.total ?? 0} Item
          </p>
          <Pagination
            aria-label="pagination"
            showControls={false}
            classNames={{
              cursor: "bg-black text-white",
            }}
            disableAnimation
            color="primary"
            initialPage={paginationParams.page}
            page={paginationParams.page}
            total={tickets?.data?.totalPage ?? 0}
            variant="bordered"
            onChange={(value) => {
              router.push(
                `${path}?${createQueryString("page", value.toString())}`,
              );
            }}
          />
        </div>
      </Suspense>
    );
  };

  const handleFilter = (val: any) => {
    setFilter(val);
  };

  const handleReset = () => {
    setFilter({});
  };

  const handleExportCallback = () => {}

  return (
    <>
      <div className="flex md:justify-between gap-4 items-end mb-4">
        <div>
          <h1 className="font-semibold text-xl mb-1">
            All Tickets from Customer
          </h1>
          <p className="text-sm text-gray-500">Manage and Track Tickets</p>
        </div>

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
          <Button
            className="flex-none"
            startContent={<HiOutlineDownload size={20} />}
            color="primary"
            onClick={() => onExportOpen()}
          >
            Export
          </Button>
        </div>
      </div>

      <div className="mb-4 border rounded p-4">
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

      <ModalExport
        isOpen={isExportOpen}
        onOpenChange={onExportOpenChange}
        onCallback={handleExportCallback}
      />
    </>
  );
}
