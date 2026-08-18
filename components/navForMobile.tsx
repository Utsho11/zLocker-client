"use client";

import { Link } from "@heroui/link";
import { NavbarMenu, NavbarMenuItem } from "@heroui/navbar";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";

const NavForMobile = () => {
  const path = usePathname();

  return (
    <NavbarMenu>
      <div className="mx-4 mt-2 flex flex-col gap-2">
        {siteConfig.navItems.map((item) => (
          <NavbarMenuItem key={item.href}>
            <Link
              as={NextLink}
              color={item.href === path ? "primary" : "foreground"}
              href={item.href}
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </div>
    </NavbarMenu>
  );
};

export default NavForMobile;
