"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { track } from "@/lib/track-client"

const item =
  "relative z-10 flex h-7 w-[4.5rem] items-center justify-center pl-[0.2em] leading-none transition-colors duration-300"

export default function SiteToggle({ className }: { className?: string }) {
  const classic = usePathname()?.startsWith("/classic")

  return (
    <div
      className={cn(
        "relative inline-flex w-fit items-center rounded-full border border-white/15 bg-black/60 p-1 font-mono text-[11px] uppercase tracking-[0.2em] backdrop-blur",
        className
      )}
      role="group"
      aria-label="Switch site version"
    >
      <span
        aria-hidden
        className={cn(
          "absolute left-1 top-1 h-7 w-[4.5rem] rounded-full transition-[transform,background-color,box-shadow] duration-500 ease-[cubic-bezier(.7,0,.2,1)]",
          classic
            ? "translate-x-[4.5rem] bg-gradient-to-r from-pink-500 to-cyan-500"
            : "translate-x-0 bg-[#ff2a8a] shadow-[0_0_18px_#ff2a8a]"
        )}
      />
      <Link
        href="/"
        data-track="site-toggle-3d"
        aria-current={classic ? undefined : "page"}
        onClick={() => track({ name: "site_toggle", label: "3d" })}
        className={cn(item, classic ? "text-white/60 hover:text-white" : "font-bold text-black")}
      >
        3D
      </Link>
      <Link
        href="/classic"
        data-track="site-toggle-classic"
        aria-current={classic ? "page" : undefined}
        onClick={() => track({ name: "site_toggle", label: "classic" })}
        className={cn(item, classic ? "font-bold text-black" : "text-white/60 hover:text-white")}
      >
        Classic
      </Link>
    </div>
  )
}
