"use client";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useScan } from "./ScanProvider";

export default function AppShell({ children }) {
  const { setSearchQuery } = useScan();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onSearch={setSearchQuery} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}