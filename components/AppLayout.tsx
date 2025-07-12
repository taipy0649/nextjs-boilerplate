"use client";

import { ReactNode } from "react";
import BottomNavigation from "./BottomNavigation";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {title && (
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-md mx-auto px-4 py-4">
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>
        </header>
      )}

      <main className="max-w-md mx-auto px-4 py-6 pb-24">{children}</main>

      <BottomNavigation />
    </div>
  );
}
