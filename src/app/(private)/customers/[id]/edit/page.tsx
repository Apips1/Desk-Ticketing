import { Suspense } from "react";
import CustomerEditContent from "./_components/customer-edit-content";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomerEditContent />
    </Suspense>
  );
}
