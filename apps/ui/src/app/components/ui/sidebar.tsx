'use client'

import { usePathname } from "next/navigation";
import Link from "next/link";

const Sidebar = () => {
  const pathName = usePathname()

  const tabs = [
    { name: "Dashboard", href: "/dashboard" },
    // { name: "Track Wallets", href: "/dashboard/wallets" },
    // { name: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-4 text-lg font-bold">My Dashboard</div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {tabs.map((tab) => (
            <li key={tab.name}>
              <Link legacyBehavior href={tab.href}>
                <a
                  className={`block px-4 py-2 rounded-md hover:bg-gray-800 ${pathName === tab.href ? "bg-gray-800" : ""
                    }`}
                >
                  {tab.name}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
