import Link from "next/link"

export function AnnouncementBar() {
  return (
    <div className="flex h-[40px] w-full items-center justify-center text-nowrap bg-black text-center text-xs md:text-sm font-medium text-white">
      Diskon Spesial Pembukaan Platform Symmetry 50%
      <Link href="/search" className="ml-2 underline hover:no-underline">
        Belanja Sekarang
      </Link>
    </div>
  )
}