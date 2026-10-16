"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function SiteToggle({ className }: { className?: string }) {
  const classic = usePathname()?.startsWith("/classic")

  return (
    <div
      className={cn(
        "relative flex items-center rounded-full border border-white/15 bg-black/60 p-1 font-mono text-[11px] uppercase tracking-[0.2em] backdrop-blur",
        className
      )}
      role="group"
      aria-label="Switch site version"
    >
      <span
        className={cn(
          "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-all duration-500 ease-[cubic-bezier(.7,0,.2,1)]",
          classic
            ? "left-[calc(50%+2px)] bg-gradient-to-r from-pink-500 to-cyan-500"
            : "left-1 bg-[#ff2a8a] shadow-[0_0_18px_#ff2a8a]"
        )}
      />
      <Link href="/" className={cn("relative z-10 w-16 py-1 text-center transition-colors", classic ? "text-white/60 hover:text-white" : "text-black font-bold")}>
        3D
      </Link>
      <Link href="/classic" className={cn("relative z-10 w-16 py-1 text-center transition-colors", classic ? "text-black font-bold" : "text-white/60 hover:text-white")}>
        Classic
      </Link>
    </div>
  )
}
