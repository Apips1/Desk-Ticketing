import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
} from "@nextui-org/react";
import { RiMore2Fill } from "react-icons/ri";

interface CardCustomerProps {
  data?: any;
  isShowAction?: boolean;
  isDetail?: boolean;
  onDetail?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  name: string;
  description: string;
  ticketTotal: number;
  logoUrl: string;
}

const CardCustomer: React.FC<CardCustomerProps> = ({
  data,
  isShowAction,
  isDetail,
  onDetail,
  onEdit,
  onDelete,
  name,
  ticketTotal,
  description,
  logoUrl,
}) => {
  const router = useRouter();

  return (
    <div className="border bg-white px-6 py-4 shadow rounded relative">
      {isShowAction && (
        <Dropdown>
          <DropdownTrigger>
            <Button
              className="absolute top-2 right-2"
              isIconOnly
              radius="full"
              variant="light"
            >
              <RiMore2Fill />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem onClick={() => onDetail && onDetail()}>
              Detail
            </DropdownItem>
            <DropdownItem onClick={() => onEdit && onEdit()}>Edit</DropdownItem>
            <DropdownItem
              color="danger"
              className="text-danger-500"
              onClick={() => onDelete && onDelete()}
            >
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}

      {!isDetail && <h3 className="font-semibold text-lg mb-4">{name}</h3>}

      <div className="flex gap-6 items-center">
        <Image
          src={logoUrl}
          alt={`${name} logo`}
          width={100}
          height={100}
          className="rounded-full"
        />
        <div className="flex flex-col gap-2">
          <div>
            <h6 className="font-semibold text-sm">Total Ticket Submited</h6>
            <p className="text-gray-500 text-sm">{ticketTotal}</p>
          </div>
          {isDetail && (
            <>
              <div>
                <h6 className="font-semibold text-sm">Subdomain</h6>
                <a href="#" className=" text-sm text-primary">
                  {description}.solutionlab.id
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardCustomer;
