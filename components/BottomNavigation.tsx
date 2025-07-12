"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, BookOpen } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: Home, label: "ホーム" },
  { href: "/record", icon: Plus, label: "記録" },
  { href: "/journal", icon: BookOpen, label: "ジャーナル" },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center py-2 px-3 min-w-0 ${
                isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
