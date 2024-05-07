"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const CustomLink = ({ href, label }: { href: string; label: string }) => {
    return (
      <Link href={href} className={pathname === href ? "text-[#ffd700]" : ""}>
        {label}
      </Link>
    );
  };

  return (
    <nav className="p-4 px-6 bg-[#2F79C1] z-40">
      <div className="flex justify-between text-[#FAFAFA] text-lg font-semibold">
        <CustomLink href={"/"} label={"Subnetting Web"} />
        <div className="flex space-x-9">
          <CustomLink href={"/flsm"} label={"FLSM"} />
          <CustomLink href={"/vlsm"} label={"VLSM"} />
        </div>
      </div>
    </nav>
  );
}
