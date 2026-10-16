"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { track } from "@/lib/track-client"

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return
    track({ name: "page_view", path: pathname })
  }, [pathname])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const anchor = target?.closest("a") as HTMLAnchorElement | null
      if (!anchor) return

      const href = anchor.getAttribute("href") || ""
      const label = (anchor.getAttribute("data-track") || anchor.textContent || href).trim().slice(0, 120)

      if (href.includes("/assets/resume/") || label.toLowerCase().includes("resume")) {
        track({ name: "resume_download", label: label || "resume", href })
        return
      }

      if (href.startsWith("http") || href.startsWith("mailto:")) {
        track({ name: "link_click", label: label || href, href })
      }
    }

    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [])

  return <>{children}</>
}
