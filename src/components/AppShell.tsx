"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const hideNavbar = pathname === "/booking";

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

