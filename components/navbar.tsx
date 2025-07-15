import { auth } from "@clerk/nextjs/server";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { SignedIn, UserButton } from "@clerk/nextjs";

import LinkedInIcon from "./icons/LinkedIn";
import NavForMobile from "./navForMobile";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, ZLogo } from "@/components/icons";

export const Navbar = async () => {
  const { userId } = await auth();

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink
            className="flex justify-start items-center gap-1"
            href={`${userId ? "/dashboard" : "/"}`}
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
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
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
        <NavbarContent
          className="hidden sm:flex basis-1/5 sm:basis-full"
          justify="end"
        >
          <NavbarItem className="hidden sm:flex gap-2">
            <Link
              isExternal
              aria-label="LinkedIn"
              href={siteConfig.links.linkedIn}
            >
              <LinkedInIcon />
            </Link>
            <Link isExternal aria-label="Github" href={siteConfig.links.github}>
              <GithubIcon className="text-default-500" />
            </Link>
            <ThemeSwitch />

            {userId && (
              <SignedIn>
                <UserButton />
              </SignedIn>
            )}
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        {userId && (
          <SignedIn>
            <UserButton />
          </SignedIn>
        )}
        <NavbarMenuToggle />
      </NavbarContent>

      <NavForMobile />
    </HeroUINavbar>
  );
};
