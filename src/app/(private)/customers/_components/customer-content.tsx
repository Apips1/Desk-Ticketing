"use client";
import { Button, Pagination, useDisclosure } from "@nextui-org/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CardCustomer from "@/components/CardCustomer";
import ModalConfirmDelete from "@/components/ModalConfirmDelete";
import { getCompanyProductList } from "@/services/customer";
import { CompanyProduct } from "@/services/customer/types";

const CustomerContent: React.FC = () => {
  const router = useRouter();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();

  const [products, setProducts] = useState<CompanyProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getCompanyProductList();
        setProducts(response.data.data.list);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = () => {
    onDeleteOpen();
  };

  const handleConfirmDelete = () => {
    onDeleteOpenChange();
    // Add delete functionality here, such as an API call to delete the customer
  };

  return (
    <>
      <div className="flex md:justify-between gap-4 items-start mb-4">
        <h1 className="font-semibold text-xl">Our Customer</h1>
        <Button color="primary" onClick={() => router.push("/customers/add")}>
          Add New Customers
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          products.map((product) => (
            <CardCustomer
              key={product.id}
              isShowAction
              onDetail={() => router.push(`/customers/${product.id}/detail`)}
              onEdit={() => router.push(`/customers/${product.id}/edit`)}
              onDelete={() => handleDelete()}
              name={product.name}
              description={product.company.name} // Example of displaying the associated company name
              ticketTotal={product.ticketTotal} // Additional field from CompanyProduct
              logoUrl={product.logo.url}
            />
          ))
        )}
      </div>
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

      <ModalConfirmDelete
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        onDelete={handleConfirmDelete}
        content="Are you sure to delete this customer?"
      />
    </>
  );
};

export default CustomerContent;
