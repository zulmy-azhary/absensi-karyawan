import { NavLink as BaseNavLink, type NavLinkProps as BaseNavLinkProps } from "@remix-run/react";
import { type LucideIcon } from "lucide-react";
import React from "react";
import { cn } from "~/lib/utils";

type NavLinkProps = React.PropsWithChildren<BaseNavLinkProps> & {
  icon: LucideIcon;
};

const NavLink: React.ForwardRefRenderFunction<HTMLAnchorElement, NavLinkProps> = (props, ref) => {
  const { children, icon: Icon, ...rest } = props;
  return (
    <BaseNavLink
      ref={ref}
      {...rest}
      className={({ isActive }) =>
        cn(isActive ? "group bg-blue-500/20" : "", "flex items-center gap-x-2 px-3 py-2 rounded-sm")
      }
      end
    >
      <div className="p-2 rounded shadow-md border-[1px] group-visited:bg-blue-500 group-visited:border-blue-500">
        <Icon className="text-base h-4 w-4 group-visited:text-blue-500" />
      </div>
      <span className="inline-block w-full font-medium text-sm group-visited:text-blue-500">
        {children}
      </span>
    </BaseNavLink>
  );
}

export default React.forwardRef(NavLink);