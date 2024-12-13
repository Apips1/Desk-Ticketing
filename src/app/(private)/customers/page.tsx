import { Suspense } from "react";
import CustomerContent from "./_components/customer-content";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomerContent />
    </Suspense>
  );
}
