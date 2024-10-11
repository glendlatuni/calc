'use client'
import * as React from "react"
import Link from "next/link"


import {
  NavigationMenu,

  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,

  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

const items = ["Sloof", "Balock", "Plesteran", "Pondasi", "Kolom"]

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center h-16">
          <div className="hidden sm:flex sm:items-center">
            <NavigationMenu>
              <NavigationMenuList>
                {items.map((item) => (
                  <NavigationMenuItem key={item}>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} href={`/${item.toLowerCase()}`}>
                      {item}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="sm:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {items.map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 text-center"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar