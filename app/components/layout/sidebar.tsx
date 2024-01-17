import { Form } from "@remix-run/react";
import { useCallback } from "react";
import useOnClickOutside from "~/hooks/useOnClickOutside";
import { cn } from "~/lib/utils";
import {
  BookText,
  LayoutDashboard,
  Library,
  LogOut,
  User as LucideUser,
  MapPinned,
  LayoutList,
  Users,
  X,
  Forward,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import NavLink from "~/components/ui/nav-link";
import { type $Enums } from "@prisma/client";

type SidebarProps = {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLaptop: boolean;
  role: $Enums.Role;
};

export default function Sidebar(props: SidebarProps) {
  const { isOpen, setOpen, isLaptop, role } = props;
  const onClosed = useCallback(() => !isLaptop && setOpen(false), [isLaptop, setOpen]);
  const sidebarRef = useOnClickOutside(isOpen, onClosed);

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "fixed inset-y-0 z-10 flex w-[300px] flex-col gap-y-12 justify-between overflow-hidden px-6 py-6 border-r-2 bg-white duration-300 lg:duration-0",
        isOpen ? "left-0" : "-left-[300px]"
      )}
    >
      <div className="flex justify-between lg:justify-center items-center">
        <h2 className="text-center font-semibold text-xl uppercase tracking-widest">
          Absensi Karyawan
        </h2>
        {!isLaptop ? (
          <Button onClick={onClosed} variant="ghost" className="h-5 w-5 p-0 lg:hidden">
            <X />
          </Button>
        ) : null}
      </div>
      <div className="grow flex flex-col gap-y-5">
        <ul className="flex flex-col gap-y-2">
          <span className="text-sm font-bold uppercase tracking-wide">Menu</span>
          {role === "Admin" ? (
            <NavLink icon={LayoutDashboard} to="/app">
              Dashboard
            </NavLink>
          ) : null}
          {role === "Admin" ? (
            <NavLink icon={Users} to="/app/users">
              Daftar Pengguna
            </NavLink>
          ) : null}
          <NavLink icon={LucideUser} to="/app/profile">
            Profil
          </NavLink>
        </ul>
        <ul className="flex flex-col gap-y-2">
          <span className="text-sm font-bold uppercase tracking-wide">Manajemen Absensi</span>
          {role === "Karyawan" ? (
            <>
              <NavLink icon={BookText} to="/app/absensi">
                Lakukan Absensi
              </NavLink>
              <NavLink icon={LayoutList} to="/app/absensi/attendance">
                Attendance
              </NavLink>
              <NavLink icon={Forward} to="/app/absensi/submission">
                Pengajuan
              </NavLink>
            </>
          ) : null}
          {role === "Admin" ? (
            <NavLink icon={MapPinned} to="/app/absensi/settings">
              Pengaturan Lokasi
            </NavLink>
          ) : null}
        </ul>
        {role === "Admin" ? (
          <ul className="flex flex-col gap-y-2">
            <span className="text-sm font-bold uppercase tracking-wide">Laporan</span>
            <NavLink icon={Library} to="/app/report">
              Rekap Laporan
            </NavLink>
          </ul>
        ) : null}
      </div>
      <Form method="post" action="/app">
        <Button type="submit" variant="destructive" className="w-full">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </Form>
    </aside>
  );
}
