"use client";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import SignoutButton from "./SignoutButton";
import LinkedInIcon from "./icons/LinkedIn";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, ZLogo } from "@/components/icons";
import { useProfile } from "@/hooks/useAuth";
import { useAuthstore } from "@/store/AuthStore";

export const Navbar = () => {
  const path = usePathname();
  const router = useRouter();
  const { data, isSuccess } = useProfile();
  const setLoggedin = useAuthstore((s) => s.setLogin);

  const isLogin = useAuthstore((s) => s.isLogin);

  useEffect(() => {
    if (isSuccess && data) {
      setLoggedin(true);
      router.push("/dashboard");
    } else {
      setLoggedin(false);
    }
  }, [data, isSuccess, setLoggedin]);

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink
            className="flex justify-start items-center gap-1"
            href={`${isLogin}` ? "/dashboard" : "/"}
          >
            <ZLogo />
            <p className="font-bold text-inherit">zLocker</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link
            isExternal
            aria-label="Discord"
            href={siteConfig.links.linkedIn}
          >
            <LinkedInIcon />
          </Link>
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        <>{isLogin ? <SignoutButton /> : <></>}</>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

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
        <>{isLogin ? <SignoutButton /> : <></>}</>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
