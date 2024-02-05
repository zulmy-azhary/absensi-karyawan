import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { authenticator } from "~/actions/auth.server";
import Sidebar from "~/components/layout/sidebar";
import Navbar from "~/components/layout/navbar";
import { cn } from "~/lib/utils";
import useToggle from "~/hooks/useToggle";
import useMediaQuery from "~/hooks/useMediaQuery";
import { useEffect } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  return json(user);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return await authenticator.logout(request, {
    redirectTo: "/",
  });
};

export const meta: MetaFunction = () => {
  return [{ name: "description", content: "Absensi Karyawan dashboard created with remix!" }];
};

export default function AppRoot() {
  const { key } = useLocation();
  const user = useLoaderData<typeof loader>();
  const [isOpen, toggle, setOpen] = useToggle(true);
  const isLaptop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    setOpen(isLaptop);
  }, [key, isLaptop, setOpen]);

  return (
    <>
      <Sidebar isOpen={isOpen} setOpen={setOpen} isLaptop={isLaptop} />
      <main
        className={cn(
          "flex min-h-screen flex-col gap-y-5 pb-12 after:fixed after:backdrop-blur-sm after:duration-300 lg:after:backdrop-blur-none lg:after:duration-0",
          isLaptop ? "ml-[300px]" : "ml-[0px]",
          isOpen && !isLaptop ? "after:inset-0" : null
        )}
      >
        <Navbar toggle={toggle} isLaptop={isLaptop} user={user} />
        <section className="grid gap-y-16 px-8">
          <Outlet />
        </section>
      </main>
    </>
  );
}
