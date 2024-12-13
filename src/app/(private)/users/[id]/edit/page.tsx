"use client";
import { Suspense } from "react";
import UserEditContent from "./_components/user-edit-content";

export default function TicketPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserEditContent />
    </Suspense>
  );
}
