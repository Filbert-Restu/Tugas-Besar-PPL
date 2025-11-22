import LogoutButton from "@/components/layout/LogoutButton";
import Link from "next/link";

export default function PlatformDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      <p>Selamat datang di panel admin marketplace.</p>
      <aside className="w-64 bg-slate-900 text-white p-4">
        <div className="font-bold text-xl mb-6">PLATFORM ADMIN</div>
        <nav className="space-y-2">
          <Link href="/platform" className="block p-2 hover:bg-slate-700 rounded">Dashboard</Link>
          <Link href="/platform/verification" className="block p-2 hover:bg-slate-700 rounded">Verification</Link>
          <Link href="/platform/users" className="block p-2 hover:bg-slate-700 rounded">Users</Link>
          <Link href="/platform/reports" className="block p-2 hover:bg-slate-700 rounded">Reports</Link>
          <LogoutButton />
        </nav>
      </aside>
      {/* Statistik bisa ditaruh sini */}
    </div>
  );
}