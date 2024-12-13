import { Suspense } from "react";
import CustomerDetailContent from "./_components/customer-detail-content";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomerDetailContent />
    </Suspense>
  );
}
