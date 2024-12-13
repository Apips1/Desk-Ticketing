"use client";
import {
  DataCompany,
  ResponseListCompany,
} from "@/app/_types/ticket/response-list-company";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Fragment } from "react";
import { HiCheck } from "react-icons/hi";

type StatusFilterModalProps = {
  isOpen: boolean;
  onClose: (success: boolean) => void;
  selectedStatus: string;
  selectedSort: string;
  subject: string;
  code: string;
  companyProductName: string;
  submit: (data: SubmitData[]) => void;
  reset: () => void;
};

type Status = {
  id: string;
  name: string;
  selected: boolean;
};

type SubmitData = {
  key: string;
  value: string;
};

function StatusFilterModal(props: StatusFilterModalProps) {
  const [statusList, setStatusList] = useState<Status[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("");
  const [ticketCode, setTicketCode] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");

  const data: Status[] = useMemo(
    () => [
      { id: "open", name: "Open", selected: false },
      { id: "closed", name: "Closed", selected: false },
      { id: "in_progress", name: "In Progress", selected: false },
      { id: "resolve", name: "Resolve", selected: false },
      { id: "cancel", name: "Cancel", selected: false },
    ],
    [],
  );

  useEffect(() => {
    let temp: Status[] = data.map((item) => {
      if (props.selectedStatus == "") {
        return item;
      }
      var listStatus = props.selectedStatus.split(",");
      for (let i = 0; i < listStatus.length; i++) {
        if (item.id == listStatus[i]) {
          return { ...item, selected: true };
        }
      }
      return item; // Add a default return value
    });
    setSelectedCompany(props.companyProductName);
    setStatusList(temp);
    setSelectedSort(props.selectedSort);
    setTicketCode(props.code);
    setSubject(props.subject);
  }, [props, data]);

  const onReset = () => {
    let temp = statusList.map((item) => {
      return { ...item, selected: false };
    });
    setStatusList(temp);
    setSelectedSort("");
    setTicketCode("");
    setSubject("");
    setSelectedCompany("");
    props.reset();
  };

  const { data: listCompany } = useHttp<ResponseListCompany>(
    "/agent/product/list",
  );

  const onSubmitFilter = () => {
    let status = statusList
      .filter((item) => item.selected)
      .map((item) => item.id)
      .join(",");
    var data: SubmitData[] = [
      { key: "status", value: status },
      { key: "sort", value: selectedSort },
      { key: "subject", value: subject },
      { key: "id", value: ticketCode },
      { key: "companyProductName", value: selectedCompany },
    ];
    props.submit(data);
  };

  const onAddSelectedStatus = (status: Status) => {
    let temp = statusList.map((item) => {
      if (item.id == status.id) {
        if (item.selected) {
          return { ...item, selected: false };
        }
        return { ...item, selected: true };
      }
      return item;
    });
    setStatusList(temp);
  };

  const renderStatus = (status: Status) => {
    let color = "";
    switch (status.id) {
      case "open":
        color = "bg-green-500";
        break;
      case "close":
        color = "bg-blue-500";
        break;
      case "in_progress":
        color = "bg-violet-500";
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
      <Fragment key={status.id}>
        <Chip
          aria-label="status"
          onClick={() => {
            onAddSelectedStatus(status);
          }}
          startContent={
            <div className={`mr-1 h-2 w-2 rounded-full ${color}`}></div>
          }
          endContent={
            status.selected && (
              <div className="ml-1 h-4 w-4 rounded-full bg-green-400 flex items-center justify-center">
                <HiCheck className="h-3 w-3 text-white" />
              </div>
            )
          }
          className="capitalize cursor-pointer"
          size="sm"
          variant="bordered"
          color={status.selected ? "primary" : "default"}
        >
          {status.name}
        </Chip>
      </Fragment>
    );
  };

  return (
    <Modal
      aria-label="filter"
      size="xl"
      isOpen={props.isOpen}
      onClose={() => {
        props.onClose(false);
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Filter</ModalHeader>
            <ModalBody className="space-y-2">
              <form className="space-y-2">
                <Select
                  aria-label="sort"
                  id="sort"
                  size="sm"
                  label="Sort by"
                  className="w-full"
                  value={selectedSort || "createdAt"}
                  defaultSelectedKeys={[selectedSort || "createdAt"]}
                  onChange={(e) => {
                    const target = e.target as HTMLSelectElement;
                    setSelectedSort(target.value);
                  }}
                >
                  <SelectItem value="createdAt" key={"createdAt"}>
                    Date Created
                  </SelectItem>
                  <SelectItem value="updatedAt" key={"updatedAt"}>
                    Last Modified
                  </SelectItem>
                </Select>
                <Select
                  aria-label="Company"
                  id="company"
                  label="Select Company"
                  size="sm"
                  radius="sm"
                  className="w-full"
                  value={selectedCompany}
                  defaultSelectedKeys={[selectedCompany || ""]}
                  onChange={(e) => {
                    const target = e.target as HTMLSelectElement;
                    setSelectedCompany(target.value);
                  }}
                >
                  {listCompany?.data?.list?.map((company: DataCompany) => (
                    <SelectItem value={company.name} key={company.name}>
                      {company.name}
                    </SelectItem>
                  )) || []}
                </Select>
                <Input
                  id="searchCode"
                  aria-label="search"
                  placeholder="Search by ticket id"
                  size="lg"
                  radius="sm"
                  value={ticketCode}
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    setTicketCode(target.value);
                  }}
                />
                <Input
                  id="searchSubject"
                  aria-label="search"
                  placeholder="Search by subject"
                  size="lg"
                  radius="sm"
                  value={subject}
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    setSubject(target.value);
                  }}
                />
              </form>
              <div className="grid-cols space-x-2">
                {statusList.map((status) => renderStatus(status))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                aria-label="close"
                onClick={() => {
                  onReset();
                }}
                className="bg-white text-default-700 border-primary px-4 py-2 rounded-md"
                variant="bordered"
              >
                Reset
              </Button>
              <Button
                aria-label="filter"
                onClick={() => {
                  onSubmitFilter();
                }}
                className="bg-primary text-white rounded-md ml-2"
              >
                Filter
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default StatusFilterModal;
