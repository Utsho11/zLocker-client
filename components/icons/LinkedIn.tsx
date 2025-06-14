"use client";

interface LinkedInIconProps {
  size?: number;
  className?: string;
  title?: string;
}

const LinkedInIcon = ({
  size = 24,
  className = "",
  title = "LinkedIn Icon",
}: LinkedInIconProps) => {
  return (
    <svg
      aria-label={title}
      className={`text-[#0077b5] ${className}`}
      fill="currentColor"
      height={size}
      role="img"
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path d="M4.98 3.5a2.5 2.5 0 11-.01 5.001A2.5 2.5 0 014.98 3.5zM2 9h6v12H2zM9.5 9h5.37v1.71h.08c.75-1.34 2.58-2.27 4.08-2.27 4.36 0 5.17 2.87 5.17 6.59V21H18v-5.6c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.95V21H9.5z" />
    </svg>
  );
};

export default LinkedInIcon;
