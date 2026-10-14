"use client"

import ContributionSkyline from "@/components/ui/contribution-skyline"

export default function Demo() {
  return (
    <div className="w-full bg-[#070709] px-4 py-10 sm:px-8">
      <div className="mx-auto w-full max-w-[980px]">
        <ContributionSkyline endDate="2026-10-14" />
      </div>
    </div>
  )
}
