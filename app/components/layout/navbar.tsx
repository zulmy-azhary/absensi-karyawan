import { Form, Link } from "@remix-run/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { LogOut, Menu, User as UserIcon } from "lucide-react";
import { type UserType } from "~/services/auth.server";
import { cn } from "~/lib/utils";
import { type SerializeFrom } from "@remix-run/node";

type NavbarProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  user: SerializeFrom<UserType>;
  toggle?: () => void;
  isLaptop: boolean;
};

export default function Navbar(props: NavbarProps) {
  const { user, toggle, isLaptop, className, ...rest } = props;

  return (
    <div className={cn("flex justify-between items-center border-b-2", className)} {...rest}>
      {!isLaptop ? (
        <Button variant="ghost" className="rounded-none" onClick={toggle}>
          <Menu />
        </Button>
      ) : null}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 lg:ml-auto"
          >
            {user.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="text-center py-4">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-sm">{user.role}</p>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link to="/app/profile">
              <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Form method="post">
              <Button type="submit" variant="destructive" className="grow text-start">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Button>
            </Form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
