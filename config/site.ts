export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "zLocker",
  description: "A simple and secure text-image storing platform.",
  navItems: [
    {
      label: "Guest Locker",
      href: "/guest",
    },
    {
      label: "Pricing & Plans",
      href: "/pricing",
    },
    {
      label: "Docs",
      href: "/docs",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ],
  links: {
    github: "https://github.com/Utsho11",
    linkedIn: "https://www.linkedin.com/in/utshoroy",
  },
};
