"use client";

import { Link } from "@heroui/link";
import { NavbarMenu, NavbarMenuItem } from "@heroui/navbar";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";

const NavForMobile = () => {
  const path = usePathname();

  return (
    <NavbarMenu>
      <div className="mx-4 mt-2 flex flex-col gap-2">
        {siteConfig.navItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
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
