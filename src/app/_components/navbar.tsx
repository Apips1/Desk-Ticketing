"use client";
import React from "react";
import {
  Navbar,
  NavbarContent,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { HiUserCircle } from "react-icons/hi";
import { User } from "../_types/auth/response-login";
import { R } from "@/types/response";
import Cookies from "js-cookie";
import { AUTH_KEY, USER } from "@/constants/auth";
import { useAuthMe } from "@/services/auth";

export default function TopNavbar() {
  const { data, isFetching } = useAuthMe();

  const user = useMemo(() => data?.data, [data]);

  return (
    <Navbar
      classNames={{
        wrapper: "h-20 px-5 max-w-[100%] border-b",
      }}
    >
      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <div role="button" className="flex">
              {!isFetching && (
                <div className="mr-2">
                  <p className="text-sm">{user?.name ?? ""}</p>
                  <p className="text-xs text-gray-500 font-light">
                    {user?.name ?? ""}
                  </p>
                </div>
              )}
              <HiUserCircle
                size={40}
                className="text-gray-400 transition-transform"
              />
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem
              onClick={() => {
                Cookies.remove(AUTH_KEY);
                Cookies.remove(USER);
                window.location.href = "/login";
              }}
              key="logout"
              color="danger"
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
