"use client";
import { Sidebar, Menu, MenuItem, sidebarClasses } from "react-pro-sidebar";
import { FaChartSimple, FaRegUser, FaUser } from "react-icons/fa6";
import { FaTicketAlt, FaUserAlt } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import BuildingBg from "../../../public/assets/building-bg.png";
import { Image } from "@nextui-org/react";
import Link from "next/link";

export default function LeftSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const activeMenu = (path: string) => {
    if (path === "/") return pathname == path;
    else {
      if (pathname.indexOf(path) === 0 && path != "/") return true;
      else return false;
    }
  };

  return (
    <Sidebar
      rootStyles={{
        [`.${sidebarClasses.container}`]: {
          backgroundColor: "white",
          borderRight: "0px",
          zIndex: 0,
        },
      }}
      className="h-screen"
    >
      <div className="px-4">
        <div
          className="rounded-xl mb-5
        "
        >
          <Image
            width={150}
            alt="slabs logo"
            src="/assets/solutionlabs-logo.png"
          />
        </div>
      </div>
      <Menu
        menuItemStyles={{
          button: ({ active }) => {
            return {
              color: active ? "#FBF9F1" : "#64748B",
              backgroundColor: active ? "#77C045" : undefined,
              "&:hover": {
                color: "#FBF9F1",
                backgroundColor: "#758694",
              },
            };
          },
        }}
      >
        <MenuItem
          href="/"
          className="rounded-md"
          active={activeMenu("/")}
          icon={<FaChartSimple />}
        >
          Dashboard
        </MenuItem>
        <MenuItem
          href="/tickets"
          className="rounded-md"
          active={activeMenu("/tickets")}
          icon={<FaTicketAlt />}
        >
          Tickets
        </MenuItem>
        <MenuItem
          href="/customers"
          className="rounded-md"
          active={activeMenu("/customers")}
          icon={<FaRegUser />}
        >
          Customer
        </MenuItem>
        <MenuItem
          href="/users"
          className="rounded-md"
          active={activeMenu("/users")}
          icon={<FaRegUser />}
        >
          Manage User
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}
