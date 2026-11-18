"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-row bg-[#0b1120] text-white">
      {/* Espaço reservado para o menu mobile */}
      <div
        className={`shrink-0 transition-[width] duration-300 lg:hidden ${
          mobileOpen ? "w-64" : "w-16"
        }`}
      />

      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}