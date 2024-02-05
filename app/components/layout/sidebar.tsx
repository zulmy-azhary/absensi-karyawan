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
import { RoleGate } from "~/components/role-gate";

type SidebarProps = {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLaptop: boolean;
};

export default function Sidebar(props: SidebarProps) {
  const { isOpen, setOpen, isLaptop } = props;
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
          <RoleGate allowedRole="Admin">
            <NavLink icon={LayoutDashboard} to="/app">
              Dashboard
            </NavLink>
            <NavLink icon={Users} to="/app/pengguna">
              Daftar Pengguna
            </NavLink>
          </RoleGate>
          <NavLink icon={LucideUser} to="/app/profil">
            Profil
          </NavLink>
        </ul>
        <ul className="flex flex-col gap-y-2">
          <span className="text-sm font-bold uppercase tracking-wide">Manajemen Absensi</span>
          <RoleGate allowedRole="Karyawan">
            <NavLink icon={BookText} to="/app/absensi">
              Lakukan Absensi
            </NavLink>
            <NavLink icon={LayoutList} to="/app/absensi/kehadiran">
              Kehadiran
            </NavLink>
            <NavLink icon={Forward} to="/app/absensi/pengajuan">
              Pengajuan
            </NavLink>
          </RoleGate>
          <RoleGate allowedRole="Admin">
            <NavLink icon={MapPinned} to="/app/absensi/pengaturan">
              Pengaturan Lokasi
            </NavLink>
          </RoleGate>
        </ul>
        <RoleGate allowedRole="Admin">
          <ul className="flex flex-col gap-y-2">
            <span className="text-sm font-bold uppercase tracking-wide">Laporan</span>
            <NavLink icon={Library} to="/app/report">
              Rekap Laporan
            </NavLink>
          </ul>
        </RoleGate>
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
